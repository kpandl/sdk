# Experimental threaded Memory64 proving

This opt-in experiment builds the SDK for `wasm64-unknown-unknown` with an 8 GiB
linear-memory maximum and the existing Rayon worker pool. The stock wasm-bindgen
0.2.129 CLI rejects threaded Memory64. The included toolchain patch implements
64-bit thread/TLS/stack addresses and the required JavaScript memory descriptor.

This directory preserves the source changes used in the verified experiment.
It builds a pinned SDK 0.12.1 checkout in a separate workspace. It does not change
the current checkout's default packages, manifests, toolchain or build outputs.
The patches are applied to local source copies. Cargo's registry sources remain
unchanged. No keys, private records, transaction payloads or credentials are
included.

## Build

Requirements: Node.js 20 or newer, Git, tar, Rust 1.96.0, Rust nightly-2026-04-02
with `rust-src`, and Binaryen 125. The first build needs network access for pinned
Git revisions, checksum-verified crate archives and Cargo dependencies.

```sh
rustup toolchain install 1.96.0
rustup toolchain install nightly-2026-04-02 --component rust-src
npm install --prefix target/memory64-tools --no-save binaryen@125.0.0

WASM_OPT_BIN="$PWD/target/memory64-tools/node_modules/binaryen/bin/wasm-opt" \
  node wasm/experimental/memory64/prepare.mjs
```

The default workspace is `wasm/target/memory64`. Use `--workspace=/absolute/path`
to select another location. Reuse requires matching source revisions and patches;
the script does not reset existing source changes. All generated files remain
under the selected workspace.

The mainnet package is written to
`WORKSPACE/sdk-proving-wasm64/wasm/dist/mainnet-threads64`. Use its WASM, JavaScript,
snippets and worker together. Call `initThreadPool(threads)` with the desired pool
size; this experiment does not impose a fixed six-thread limit. Six threads were
the host's normal extension policy for the measured eight-core machine.

Additional options:

```sh
# Verify pins, download source copies and apply patches without compiling.
node wasm/experimental/memory64/prepare.mjs --prepare-only

# Select the existing serial feature for a single-worker comparison.
WASM_OPT_BIN=/absolute/path/to/wasm-opt \
  node wasm/experimental/memory64/prepare.mjs --single-thread

# Build the same experimental sources for the 4 GiB wasm32 target.
WASM_OPT_BIN=/absolute/path/to/wasm-opt \
  node wasm/experimental/memory64/prepare.mjs --target=wasm32-unknown-unknown
```

## Source changes

The seven patches are readable source diffs against the revisions/releases in
`manifest.json` and `dependency-provenance.json`:

- `sdk-v0.12.1.patch`: pin snarkVM 4.12 and wasm-bindgen 0.2.129, select the serial
  closure implementation when requested, add diagnostic counters, and build
  coherent mainnet packages with a caller-selected thread pool.
- `snarkvm-v4.12.0.patch`: select browser query/filesystem cfgs for wasm64 and keep
  the diagnostic counters wide enough for addresses and byte counts above 4 GiB.
  This frozen benchmark patch also includes the earlier third-round buffer change
  and optional scheduling diagnostics. The measured threaded run uses mode 0.
- `wasm-bindgen-0.2.129.patch`: port the threading transform to Memory64. Raw memory
  addresses use i64; binding pointer/usize values use wasm-bindgen's f64 ABI.
  Imported memory uses `address: 'i64'` and BigInt page counts. The existing wasm32
  transform snapshot stays unchanged. A new test validates addresses above 4 GiB.
  The patch also narrows the local CLI workspace to avoid unrelated Git examples.
- The reqwest 0.11.27/0.13.2, getrandom 0.4.2 and dirs 4.0.0 patches include wasm64
  in their browser cfgs. Source archives are checked before extraction. The
  wasm-bindgen CLI's tested dependency lockfile is included separately.

The companion snarkVM draft isolates the browser-target compatibility
changes and native CPU flag exclusion for review. The earlier Varuna scratch-buffer change is tracked in
<https://github.com/kpandl/snarkVM/pull/1>. The frozen source patches retain both
parts so that the measured build can be reconstructed without conflating it with
a fresh proof on the companion branch.

## Validation and measurements

The pinned prototype built and SDK-verified the mainnet
`shield_swap_router.aleo/swap_from_wrapped` transaction and its private fee. No
transaction was broadcast. Both parallel runs used the same private fixture hash,
warm function-key cache, six-thread pool and verified local public parameters.
Mainnet preflight and inclusion GETs remained live network operations.

| Package | Threads | Total time | Peak linear memory | Result |
| --- | ---: | ---: | ---: | --- |
| wasm32 4.12 reference | 6 | 227.174 s | 3.968 GiB | SDK verified |
| wasm64 patched toolchain | 6 | 221.628 s | 4.087 GiB | SDK verified |
| wasm64 serial, under competing load | 1 | 1,146.170 s | 3.702 GiB | SDK verified |

The full threaded proof exceeded the old linear-memory maximum by 89.438 MiB,
with zero rejected allocations. Peak sampled proving-renderer RSS was 4.749 GiB.
This was Chrome 148.0.7778.96 on an eight-core M2 with 24 GiB of RAM, without
experimental WASM flags. A separate two-worker Rust probe verified independent
TLS above 4 GiB and 2,000 concurrent vector round trips through the shared allocator.

The reference retains bindgen 0.2.105 and schema-2 diagnostics; the port uses
0.2.129 and schema 3. One sample does not establish a speedup. The contended serial
time is excluded from clean wall-time comparisons. Diagnostics and the earlier
buffer-lifetime change are present in these packages. These are measurements of
the pinned prototype, not an unmodified production SDK or a new proof run on the
current SDK mainnet branch.

`browser-results.json`, `build-metadata.json` and `validation.json` retain numeric
evidence, original artifact/source fingerprints, phase times and test results.
Their local report paths identify the original lab artifacts; private fixtures
and transaction artifacts are intentionally not published. `--prepare-only`
checks the portable packaging independently of those earlier full-proof results.
