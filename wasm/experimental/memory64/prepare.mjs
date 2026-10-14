import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";

const here = path.dirname(fileURLToPath(import.meta.url));
const option = (name, fallback) => process.argv.find(arg => arg.startsWith(`--${name}=`))
    ?.slice(name.length + 3) ?? fallback;
const workspace = path.resolve(option("workspace", path.join(here, "../../../target/memory64")));
const prepareOnly = process.argv.includes("--prepare-only");
const singleThread = process.argv.includes("--single-thread");
const target = option("target", "wasm64-unknown-unknown");
if (!["wasm32-unknown-unknown", "wasm64-unknown-unknown"].includes(target)) {
    throw new Error("Unsupported WebAssembly target");
}
const manifest = JSON.parse(fs.readFileSync(path.join(here, "manifest.json")));
const dependencies = JSON.parse(fs.readFileSync(path.join(here, "dependency-provenance.json")));
const sha256 = file => createHash("sha256").update(fs.readFileSync(file)).digest("hex");

function run(command, args, cwd, environment = {}) {
    const result = spawnSync(command, args, {
        cwd, env: { ...process.env, ...environment }, stdio: "inherit",
    });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`${command} failed (${result.status})`);
}

function capture(command, args, cwd) {
    const result = spawnSync(command, args, { cwd, encoding: "utf8" });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`${command} failed (${result.status})`);
    return result.stdout.trim();
}

function clonePinned(source) {
    const directory = path.join(workspace, source.directory);
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
        run("git", ["init", "--quiet"], directory);
        run("git", ["remote", "add", "origin", source.repository], directory);
        run("git", ["fetch", "--depth=1", "origin", source.revision], directory);
        run("git", ["checkout", "--detach", "FETCH_HEAD"], directory);
    }
    if (capture("git", ["rev-parse", "HEAD"], directory) !== source.revision) {
        throw new Error(`Unexpected source revision in ${source.directory}; use a fresh workspace`);
    }
    return directory;
}

function applyPatch(directory, name) {
    const patch = path.join(here, "patches", name);
    const environment = { ...process.env, GIT_CEILING_DIRECTORIES: path.dirname(directory) };
    const check = reverse => spawnSync("git", ["apply", ...(reverse ? ["--reverse"] : []), "--check", patch], {
        cwd: directory, env: environment, stdio: "ignore",
    }).status === 0;
    if (check(true)) return;
    if (!check(false)) throw new Error(`Patch ${name} does not apply; existing source was not reset`);
    run("git", ["apply", patch], directory, environment);
}

fs.mkdirSync(workspace, { recursive: true });
for (const [name, expected] of Object.entries(manifest.patchSha256)) {
    if (sha256(path.join(here, "patches", name)) !== expected) {
        throw new Error(`Patch checksum mismatch: ${name}`);
    }
}
const lock = path.join(here, "wasm-bindgen-Cargo.lock");
if (sha256(lock) !== manifest.wasmBindgenLockSha256) {
    throw new Error("wasm-bindgen lockfile checksum mismatch");
}

const sdk = clonePinned(manifest.sdk);
const snarkvm = clonePinned(manifest.snarkvm);
const bindgen = clonePinned(manifest["wasm-bindgen"]);
for (const [directory, source] of [[sdk, manifest.sdk], [snarkvm, manifest.snarkvm],
    [bindgen, manifest["wasm-bindgen"]]]) {
    applyPatch(directory, source.patch);
}
fs.copyFileSync(lock, path.join(bindgen, "Cargo.lock"));

const dependencyRoot = path.join(workspace, "wasm64-proving-dependencies");
const downloads = path.join(workspace, "downloads");
fs.mkdirSync(downloads, { recursive: true });
for (const [name, metadata] of Object.entries(dependencies)) {
    const archive = path.join(downloads, `${name}.crate`);
    if (!fs.existsSync(archive)) {
        const crate = name.slice(0, name.lastIndexOf("-"));
        const response = await fetch(`https://static.crates.io/crates/${crate}/${name}.crate`);
        if (!response.ok) throw new Error(`Cannot download ${name}: HTTP ${response.status}`);
        const bytes = Buffer.from(await response.arrayBuffer());
        if (createHash("sha256").update(bytes).digest("hex") !== metadata.registryArchiveSha256) {
            throw new Error(`Downloaded archive checksum mismatch: ${name}`);
        }
        fs.writeFileSync(archive, bytes);
    }
    if (sha256(archive) !== metadata.registryArchiveSha256) {
        throw new Error(`Cached archive checksum mismatch: ${name}`);
    }
    const directory = path.join(dependencyRoot, name);
    if (!fs.existsSync(directory)) run("tar", ["-xzf", archive, "-C", dependencyRoot], workspace);
    applyPatch(directory, `${name}.patch`);
}
console.log(JSON.stringify({ event: "memory64-sources-ready", workspace, target, singleThread }));
if (prepareOnly) process.exit(0);

if (!process.env.WASM_OPT_BIN) throw new Error("Set WASM_OPT_BIN to Binaryen 125's wasm-opt executable");
const binaryen = fs.realpathSync(process.env.WASM_OPT_BIN);
if (!/\b125\b/.test(capture(binaryen, ["--version"], workspace))) {
    throw new Error("This frozen experiment requires Binaryen 125");
}
const optimizerLink = path.join(sdk, ".build-tools/binaryen/bin/wasm-opt");
fs.mkdirSync(path.dirname(optimizerLink), { recursive: true });
if (!fs.existsSync(optimizerLink)) fs.symlinkSync(binaryen, optimizerLink);
if (fs.realpathSync(optimizerLink) !== binaryen) throw new Error("Unexpected existing wasm-opt link");

const cliTarget = path.join(workspace, "bindgen-target");
run("cargo", ["+1.96.0", "build", "--release", "--locked", "--package", "wasm-bindgen-cli",
    "--bin", "wasm-bindgen", "--no-default-features"], bindgen, {
    CARGO_TARGET_DIR: cliTarget, CARGO_BUILD_JOBS: process.env.CARGO_BUILD_JOBS ?? "2",
    CARGO_INCREMENTAL: "0",
});
const wasmDirectory = path.join(sdk, "wasm");
const originalBuilder = singleThread ? "build-single.mjs" : "build-threaded.mjs";
const original = fs.readFileSync(path.join(wasmDirectory, originalBuilder), "utf8");
if (!original.includes('"--locked", "--offline",')) throw new Error("Unexpected frozen build script");
// A fresh Cargo cache also needs the build-std dependencies. Keep the frozen
// builder intact and permit locked downloads in a separately fingerprinted copy.
const portableBuilder = "build-memory64-portable.mjs";
const portable = original.replace('"--locked", "--offline",', '"--locked",')
    .replace(`sha("${originalBuilder}")`, `sha("${portableBuilder}")`);
fs.writeFileSync(path.join(wasmDirectory, portableBuilder), portable);
run(process.execPath, [portableBuilder, `--target=${target}`],
    wasmDirectory, {
        PROVING_LAB_BINDGEN: path.join(cliTarget, "release/wasm-bindgen"),
        CARGO_TARGET_DIR: path.join(wasmDirectory, "target"),
    });
console.log(JSON.stringify({ event: "memory64-build-completed", directory: path.join(wasmDirectory,
    `dist/mainnet-${singleThread ? "single" : "threads"}${target.startsWith("wasm64") ? "64" : "32"}`) }));
