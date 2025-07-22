import { useState } from "react";
import reactLogo from "./assets/react.svg";
import aleoLogo from "./assets/aleo.svg";
import "./App.css";
import helloworld_program from "../helloworld/build/main.aleo?raw";
import sklearn_program from "../sklearn_mlp_face_hash_1/build/main.aleo?raw";
import { AleoWorker } from "./workers/AleoWorker.js";

const aleoWorker = AleoWorker();
function App() {
  const [count, setCount] = useState(0);
  const [account, setAccount] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [deploying, setDeploying] = useState(false);

  const generateAccount = async () => {
    const key = await aleoWorker.getPrivateKey();
    setAccount(await key.to_string());
  };

  async function execute() {
    setExecuting(true);
    const result = await aleoWorker.localProgramExecution(
      sklearn_program,
      "main",
      [  "{struct1_0: {x0: -2i64, x1: 2i64}, struct1_1: {x0: -15i64, x1: -36i64}, struct1_2: {x0: 17i64, x1: -11i64}, struct1_3: {x0: 8i64, x1: 10i64}, struct1_4: {x0: 22i64, x1: -8i64}, struct1_5: {x0: -6i64, x1: -13i64}, struct1_6: {x0: -3i64, x1: 43i64}, struct1_7: {x0: -13i64, x1: 3i64}, struct1_8: {x0: 13i64}, struct1_9: {x0: 10i64}, struct1_10: {x0: 5i64}, struct1_11: {x0: -9i64}, struct1_12: {x0: -4i64}, struct1_13: {x0: 16i64}, struct1_14: {x0: -16i64}, struct1_15: {x0: 28i64}, struct1_16: {x0: -8i64}, struct1_17: {x0: 1i64}, struct1_18: {x0: 26i64}, struct1_19: {x0: 1i64}, struct1_20: {x0: 1i64}, struct1_21: {x0: 24i64}, struct1_22: {x0: 24i64}, struct1_23: {x0: 31i64}, struct1_24: {x0: 1i64}, struct1_25: {x0: -3i64}, struct1_26: {x0: -5i64}, struct1_27: {x0: 1i64}, struct1_28: {x0: 0i64}, struct1_29: {x0: 0i64}, struct1_30: {x0: -8i64}, struct1_31: {x0: 0i64}}",  "{struct1_0: {x0: 0i64, x1: -5i64}, struct1_1: {x0: 6i64, x1: -3i64}, struct1_2: {x0: -6i64, x1: -1i64}, struct1_3: {x0: 8i64, x1: 0i64}, struct1_4: {x0: 2i64, x1: -2i64}, struct1_5: {x0: -5i64, x1: 2i64}, struct1_6: {x0: 0i64, x1: -7i64}, struct1_7: {x0: 5i64, x1: -4i64}, struct1_8: {x0: 1i64}, struct1_9: {x0: -5i64}, struct1_10: {x0: -4i64}, struct1_11: {x0: 4i64}, struct1_12: {x0: 1i64}, struct1_13: {x0: 1i64}, struct1_14: {x0: 0i64}, struct1_15: {x0: 5i64}, struct1_16: {x0: 68i64}, struct1_17: {x0: 2i64}, struct1_18: {x0: -3i64}, struct1_19: {x0: -2i64}, struct1_20: {x0: -1i64}, struct1_21: {x0: -5i64}, struct1_22: {x0: -8i64}, struct1_23: {x0: 6i64}, struct1_24: {x0: -7i64}, struct1_25: {x0: 2i64}, struct1_26: {x0: -5i64}, struct1_27: {x0: -8i64}, struct1_28: {x0: 0i64}, struct1_29: {x0: 8i64}, struct1_30: {x0: -4i64}, struct1_31: {x0: 4i64}}",  "{struct1_0: {x0: 7i64, x1: -1i64}, struct1_1: {x0: 0i64, x1: 3i64}, struct1_2: {x0: -4i64, x1: 6i64}, struct1_3: {x0: 7i64, x1: -1i64}, struct1_4: {x0: -2i64, x1: -3i64}, struct1_5: {x0: 0i64, x1: 0i64}, struct1_6: {x0: -7i64, x1: -1i64}, struct1_7: {x0: -8i64, x1: 0i64}, struct1_8: {x0: -5i64}, struct1_9: {x0: 110i64}, struct1_10: {x0: 1i64}, struct1_11: {x0: 0i64}, struct1_12: {x0: 1i64}, struct1_13: {x0: 0i64}, struct1_14: {x0: -3i64}, struct1_15: {x0: 6i64}, struct1_16: {x0: 0i64}, struct1_17: {x0: 3i64}, struct1_18: {x0: 0i64}, struct1_19: {x0: 0i64}, struct1_20: {x0: -6i64}, struct1_21: {x0: -4i64}, struct1_22: {x0: 5i64}, struct1_23: {x0: -4i64}, struct1_24: {x0: 5i64}, struct1_25: {x0: 3i64}, struct1_26: {x0: 4i64}, struct1_27: {x0: 6i64}, struct1_28: {x0: 0i64}, struct1_29: {x0: 5i64}, struct1_30: {x0: 3i64}, struct1_31: {x0: 1i64}}",  "{struct1_0: {x0: 0i64, x1: -2i64}, struct1_1: {x0: 3i64, x1: 8i64}, struct1_2: {x0: 2i64, x1: -6i64}, struct1_3: {x0: 8i64, x1: 2i64}, struct1_4: {x0: -7i64, x1: 0i64}, struct1_5: {x0: 81i64, x1: 0i64}, struct1_6: {x0: 0i64, x1: 0i64}, struct1_7: {x0: -5i64, x1: 0i64}, struct1_8: {x0: -2i64}, struct1_9: {x0: 3i64}, struct1_10: {x0: 2i64}, struct1_11: {x0: 3i64}, struct1_12: {x0: -5i64}, struct1_13: {x0: 4i64}, struct1_14: {x0: -1i64}, struct1_15: {x0: 0i64}, struct1_16: {x0: 1i64}, struct1_17: {x0: -2i64}, struct1_18: {x0: -2i64}, struct1_19: {x0: 0i64}, struct1_20: {x0: 0i64}, struct1_21: {x0: 1i64}, struct1_22: {x0: 3i64}, struct1_23: {x0: -2i64}, struct1_24: {x0: -2i64}, struct1_25: {x0: -2i64}, struct1_26: {x0: 4i64}, struct1_27: {x0: -1i64}, struct1_28: {x0: -1i64}, struct1_29: {x0: 0i64}, struct1_30: {x0: 2i64}, struct1_31: {x0: 0i64}}",  "{struct1_0: {x0: 2i64, x1: 4i64}, struct1_1: {x0: 4i64, x1: -32i64}, struct1_2: {x0: 2i64, x1: 0i64}, struct1_3: {x0: 5i64, x1: -2i64}, struct1_4: {x0: -4i64, x1: -1i64}, struct1_5: {x0: -6i64, x1: 7i64}, struct1_6: {x0: 1i64, x1: 1i64}, struct1_7: {x0: -4i64, x1: 0i64}, struct1_8: {x0: 0i64}, struct1_9: {x0: -5i64}, struct1_10: {x0: 2i64}, struct1_11: {x0: -2i64}, struct1_12: {x0: -1i64}, struct1_13: {x0: -1i64}, struct1_14: {x0: 2i64}, struct1_15: {x0: -8i64}, struct1_16: {x0: -7i64}, struct1_17: {x0: 0i64}, struct1_18: {x0: -7i64}, struct1_19: {x0: 4i64}, struct1_20: {x0: 4i64}, struct1_21: {x0: -1i64}, struct1_22: {x0: -1i64}, struct1_23: {x0: -4i64}, struct1_24: {x0: 2i64}, struct1_25: {x0: -3i64}, struct1_26: {x0: -8i64}, struct1_27: {x0: -5i64}, struct1_28: {x0: 54i64}, struct1_29: {x0: 0i64}, struct1_30: {x0: 0i64}, struct1_31: {x0: 0i64}}",  "{struct1_0: {x0: 5i64, x1: 3i64}, struct1_1: {x0: -3i64, x1: 3i64}, struct1_2: {x0: -3i64, x1: 9i64}, struct1_3: {x0: 4i64, x1: -4i64}, struct1_4: {x0: -3i64, x1: 9i64}, struct1_5: {x0: 2i64, x1: 0i64}, struct1_6: {x0: 2i64, x1: 7i64}, struct1_7: {x0: 5i64}, struct1_8: {x0: 0i64}, struct1_9: {x0: 0i64}, struct1_10: {x0: -2i64}, struct1_11: {x0: 0i64}, struct1_12: {x0: 7i64}, struct1_13: {x0: -8i64}, struct1_14: {x0: -3i64}, struct1_15: {x0: -4i64}, struct1_16: {x0: -1i64}, struct1_17: {x0: -8i64}, struct1_18: {x0: 4i64}, struct1_19: {x0: 3i64}, struct1_20: {x0: -7i64}, struct1_21: {x0: 3i64}, struct1_22: {x0: 71i64}, struct1_23: {x0: -4i64}, struct1_24: {x0: 1i64}, struct1_25: {x0: -6i64}, struct1_26: {x0: 4i64}, struct1_27: {x0: 2i64}, struct1_28: {x0: 0i64}, struct1_29: {x0: 0i64}, struct1_30: {x0: -1i64}, struct1_31: {x0: 0i64}}",  "{struct1_0: {x0: 6i64, x1: 1i64}, struct1_1: {x0: 0i64, x1: -8i64}, struct1_2: {x0: 1i64, x1: -4i64}, struct1_3: {x0: 0i64, x1: -2i64}, struct1_4: {x0: 1i64, x1: -6i64}, struct1_5: {x0: -1i64, x1: 0i64}, struct1_6: {x0: 4i64, x1: 0i64}, struct1_7: {x0: -1i64}, struct1_8: {x0: 1i64}, struct1_9: {x0: 6i64}, struct1_10: {x0: -6i64}, struct1_11: {x0: 9i64}, struct1_12: {x0: 8i64}, struct1_13: {x0: -2i64}, struct1_14: {x0: -1i64}, struct1_15: {x0: 3i64}, struct1_16: {x0: 55i64}, struct1_17: {x0: 4i64}, struct1_18: {x0: 4i64}, struct1_19: {x0: 1i64}, struct1_20: {x0: -1i64}, struct1_21: {x0: 2i64}, struct1_22: {x0: -4i64}, struct1_23: {x0: 0i64}, struct1_24: {x0: 2i64}, struct1_25: {x0: 1i64}, struct1_26: {x0: -2i64}, struct1_27: {x0: 1i64}, struct1_28: {x0: 0i64}, struct1_29: {x0: 0i64}, struct1_30: {x0: 4i64}, struct1_31: {x0: -6i64}}",  "{struct1_0: {x0: 2i64, x1: 2i64}, struct1_1: {x0: 4i64, x1: 4i64}, struct1_2: {x0: 1i64, x1: -5i64}, struct1_3: {x0: 2i64, x1: 2i64}, struct1_4: {x0: 5i64, x1: 1i64}, struct1_5: {x0: 0i64, x1: 4i64}, struct1_6: {x0: 4i64, x1: 3i64}, struct1_7: {x0: 1i64}, struct1_8: {x0: -1i64}, struct1_9: {x0: 5i64}, struct1_10: {x0: -30i64}, struct1_11: {x0: -5i64}, struct1_12: {x0: 4i64}, struct1_13: {x0: 7i64}, struct1_14: {x0: -2i64}, struct1_15: {x0: 1i64}, struct1_16: {x0: -2i64}, struct1_17: {x0: -1i64}, struct1_18: {x0: 0i64}, struct1_19: {x0: -3i64}, struct1_20: {x0: 1i64}, struct1_21: {x0: 5i64}, struct1_22: {x0: 1i64}, struct1_23: {x0: 2i64}, struct1_24: {x0: 3i64}, struct1_25: {x0: -1i64}, struct1_26: {x0: -8i64}, struct1_27: {x0: -3i64}, struct1_28: {x0: -9i64}, struct1_29: {x0: 6i64}, struct1_30: {x0: 1i64}, struct1_31: {x0: -3i64}}",  "{struct1_0: {x0: 5i64, x1: 9i64}, struct1_1: {x0: -4i64, x1: 4i64}, struct1_2: {x0: 2i64, x1: -4i64}, struct1_3: {x0: -4i64, x1: 0i64}, struct1_4: {x0: 1i64, x1: -2i64}, struct1_5: {x0: 0i64, x1: 68i64}, struct1_6: {x0: -3i64, x1: -4i64}, struct1_7: {x0: 0i64}, struct1_8: {x0: -2i64}, struct1_9: {x0: 1i64}, struct1_10: {x0: 3i64}, struct1_11: {x0: -5i64}, struct1_12: {x0: -6i64}, struct1_13: {x0: 0i64}, struct1_14: {x0: 5i64}, struct1_15: {x0: -2i64}, struct1_16: {x0: 0i64}, struct1_17: {x0: -2i64}, struct1_18: {x0: 3i64}, struct1_19: {x0: 0i64}, struct1_20: {x0: -1i64}, struct1_21: {x0: -1i64}, struct1_22: {x0: 3i64}, struct1_23: {x0: 0i64}, struct1_24: {x0: 3i64}, struct1_25: {x0: 2i64}, struct1_26: {x0: 1i64}, struct1_27: {x0: 2i64}, struct1_28: {x0: 1i64}, struct1_29: {x0: 2i64}, struct1_30: {x0: 0i64}, struct1_31: {x0: -1i64}}",  "{struct1_0: {x0: -1i64, x1: 0i64}, struct1_1: {x0: -2i64, x1: 0i64}, struct1_2: {x0: 1i64, x1: 13i64}, struct1_3: {x0: 5i64, x1: 0i64}, struct1_4: {x0: 0i64, x1: 4i64}, struct1_5: {x0: 0i64, x1: 6i64}, struct1_6: {x0: 6i64, x1: 5i64}, struct1_7: {x0: -3i64}, struct1_8: {x0: -8i64}, struct1_9: {x0: -2i64}, struct1_10: {x0: 2i64}, struct1_11: {x0: 3i64}, struct1_12: {x0: -5i64}, struct1_13: {x0: 3i64}, struct1_14: {x0: 0i64}, struct1_15: {x0: -5i64}, struct1_16: {x0: 8i64}, struct1_17: {x0: -2i64}, struct1_18: {x0: -6i64}, struct1_19: {x0: -8i64}, struct1_20: {x0: -5i64}, struct1_21: {x0: -2i64}, struct1_22: {x0: -1i64}, struct1_23: {x0: 0i64}, struct1_24: {x0: -5i64}, struct1_25: {x0: -3i64}, struct1_26: {x0: 1i64}, struct1_27: {x0: -2i64}, struct1_28: {x0: 3i64}, struct1_29: {x0: 0i64}, struct1_30: {x0: 1i64}, struct1_31: {x0: 73i64}}",  "{struct1_0: {x0: 2i64, x1: 0i64}, struct1_1: {x0: 1i64, x1: -1i64}, struct1_2: {x0: -4i64, x1: 1i64}, struct1_3: {x0: 5i64, x1: -3i64}, struct1_4: {x0: -4i64, x1: -4i64}, struct1_5: {x0: -4i64, x1: -3i64}, struct1_6: {x0: -5i64, x1: -3i64}, struct1_7: {x0: -5i64}, struct1_8: {x0: -3i64}, struct1_9: {x0: -3i64}, struct1_10: {x0: -3i64}, struct1_11: {x0: -3i64}, struct1_12: {x0: -6i64}, struct1_13: {x0: -8i64}, struct1_14: {x0: 6i64}, struct1_15: {x0: -1i64}, struct1_16: {x0: -3i64}, struct1_17: {x0: 0i64}, struct1_18: {x0: -4i64}, struct1_19: {x0: 4i64}, struct1_20: {x0: 5i64}, struct1_21: {x0: -7i64}, struct1_22: {x0: -1i64}, struct1_23: {x0: -1i64}, struct1_24: {x0: -7i64}, struct1_25: {x0: 62i64}, struct1_26: {x0: -5i64}, struct1_27: {x0: 0i64}, struct1_28: {x0: -6i64}, struct1_29: {x0: 2i64}, struct1_30: {x0: 4i64}, struct1_31: {x0: 0i64}}",  "{struct1_0: {x0: -1i64, x1: -9i64}, struct1_1: {x0: 1i64, x1: 3i64}, struct1_2: {x0: -1i64, x1: 5i64}, struct1_3: {x0: 0i64, x1: -4i64}, struct1_4: {x0: 1i64, x1: 0i64}, struct1_5: {x0: 0i64, x1: -7i64}, struct1_6: {x0: 1i64, x1: 3i64}, struct1_7: {x0: 6i64}, struct1_8: {x0: 2i64}, struct1_9: {x0: 1i64}, struct1_10: {x0: 3i64}, struct1_11: {x0: 4i64}, struct1_12: {x0: 1i64}, struct1_13: {x0: 7i64}, struct1_14: {x0: -3i64}, struct1_15: {x0: -4i64}, struct1_16: {x0: 3i64}, struct1_17: {x0: 3i64}, struct1_18: {x0: -1i64}, struct1_19: {x0: 60i64}, struct1_20: {x0: 3i64}, struct1_21: {x0: 1i64}, struct1_22: {x0: -3i64}, struct1_23: {x0: 1i64}, struct1_24: {x0: -2i64}, struct1_25: {x0: 2i64}, struct1_26: {x0: 2i64}, struct1_27: {x0: 1i64}, struct1_28: {x0: -4i64}, struct1_29: {x0: 0i64}, struct1_30: {x0: -3i64}, struct1_31: {x0: -2i64}}",  "{struct1_0: {x0: -1i64, x1: -3i64}, struct1_1: {x0: 1i64, x1: -1i64}, struct1_2: {x0: 0i64, x1: 1i64}, struct1_3: {x0: -3i64, x1: -2i64}, struct1_4: {x0: -2i64, x1: 4i64}, struct1_5: {x0: -2i64, x1: 1i64}, struct1_6: {x0: 0i64, x1: -4i64}, struct1_7: {x0: -1i64}, struct1_8: {x0: 0i64}, struct1_9: {x0: 3i64}, struct1_10: {x0: 0i64}, struct1_11: {x0: -1i64}, struct1_12: {x0: -1i64}, struct1_13: {x0: -30i64}, struct1_14: {x0: -4i64}, struct1_15: {x0: 0i64}, struct1_16: {x0: 1i64}, struct1_17: {x0: -2i64}, struct1_18: {x0: -1i64}, struct1_19: {x0: -1i64}, struct1_20: {x0: -1i64}, struct1_21: {x0: -4i64}, struct1_22: {x0: -1i64}, struct1_23: {x0: 1i64}, struct1_24: {x0: 1i64}, struct1_25: {x0: -3i64}, struct1_26: {x0: 1i64}, struct1_27: {x0: -4i64}, struct1_28: {x0: -1i64}, struct1_29: {x0: -3i64}, struct1_30: {x0: 0i64}, struct1_31: {x0: -1i64}}",  "{struct1_0: {x0: -2i64, x1: -1i64}, struct1_1: {x0: 2i64, x1: -3i64}, struct1_2: {x0: 0i64, x1: -1i64}, struct1_3: {x0: -3i64, x1: 1i64}, struct1_4: {x0: 2i64, x1: -1i64}, struct1_5: {x0: -2i64, x1: -2i64}, struct1_6: {x0: -2i64, x1: 1i64}, struct1_7: {x0: -32i64}, struct1_8: {x0: 3i64}, struct1_9: {x0: 6i64}, struct1_10: {x0: 0i64}, struct1_11: {x0: 0i64}, struct1_12: {x0: -1i64}, struct1_13: {x0: 0i64}, struct1_14: {x0: -2i64}, struct1_15: {x0: 5i64}, struct1_16: {x0: 1i64}, struct1_17: {x0: 4i64}, struct1_18: {x0: -2i64}, struct1_19: {x0: 1i64}, struct1_20: {x0: 0i64}, struct1_21: {x0: 6i64}, struct1_22: {x0: 3i64}, struct1_23: {x0: 6i64}, struct1_24: {x0: -2i64}, struct1_25: {x0: -6i64}, struct1_26: {x0: 0i64}, struct1_27: {x0: -2i64}, struct1_28: {x0: -1i64}, struct1_29: {x0: -6i64}, struct1_30: {x0: -1i64}, struct1_31: {x0: -3i64}}",  "{struct1_0: {x0: -3i64, x1: -5i64}, struct1_1: {x0: 2i64, x1: 6i64}, struct1_2: {x0: -1i64, x1: -4i64}, struct1_3: {x0: -1i64, x1: 5i64}, struct1_4: {x0: 46i64, x1: -2i64}, struct1_5: {x0: 5i64, x1: -2i64}, struct1_6: {x0: 1i64, x1: 1i64}, struct1_7: {x0: -3i64}, struct1_8: {x0: 5i64}, struct1_9: {x0: -9i64}, struct1_10: {x0: 0i64}, struct1_11: {x0: 7i64}, struct1_12: {x0: 2i64}, struct1_13: {x0: -1i64}, struct1_14: {x0: 8i64}, struct1_15: {x0: -5i64}, struct1_16: {x0: 1i64}, struct1_17: {x0: 3i64}, struct1_18: {x0: 6i64}, struct1_19: {x0: -2i64}, struct1_20: {x0: -3i64}, struct1_21: {x0: 0i64}, struct1_22: {x0: 2i64}, struct1_23: {x0: -3i64}, struct1_24: {x0: -6i64}, struct1_25: {x0: 2i64}, struct1_26: {x0: -5i64}, struct1_27: {x0: 5i64}, struct1_28: {x0: 8i64}, struct1_29: {x0: 6i64}, struct1_30: {x0: 5i64}, struct1_31: {x0: 5i64}}",  "{struct1_0: {x0: -1i64, x1: -3i64}, struct1_1: {x0: 63i64, x1: 4i64}, struct1_2: {x0: 7i64, x1: 2i64}, struct1_3: {x0: 1i64, x1: 7i64}, struct1_4: {x0: 7i64, x1: 10i64}, struct1_5: {x0: -3i64, x1: 3i64}, struct1_6: {x0: 1i64, x1: 4i64}, struct1_7: {x0: 3i64}, struct1_8: {x0: 10i64}, struct1_9: {x0: -5i64}, struct1_10: {x0: -6i64}, struct1_11: {x0: 3i64}, struct1_12: {x0: -1i64}, struct1_13: {x0: 607i64}, struct1_14: {x0: -8i64}, struct1_15: {x0: 0i64}, struct1_16: {x0: -5i64}, struct1_17: {x0: 8i64}, struct1_18: {x0: -6i64}, struct1_19: {x0: -1i64}, struct1_20: {x0: -7i64}, struct1_21: {x0: 6i64}, struct1_22: {x0: -8i64}, struct1_23: {x0: -2i64}, struct1_24: {x0: -4i64}, struct1_25: {x0: -8i64}, struct1_26: {x0: 0i64}, struct1_27: {x0: 1i64}, struct1_28: {x0: 4i64}, struct1_29: {x0: -10i64}, struct1_30: {x0: -10i64}, struct1_31: {x0: -607i64}}"],
    );
    setExecuting(false);

    alert(JSON.stringify(result));
  }

  async function deploy() {
    setDeploying(true);
    try {
      const result = await aleoWorker.deployProgram(helloworld_program);
      console.log("Transaction:")
      console.log("https://explorer.provable.com/transaction/" + result)
      alert("Transaction ID: " + result);
    } catch (e) {
      console.log(e)
      alert("Error with deployment, please check console for details");
    }
    setDeploying(false);
  }

  return (
    <>
      <div>
        <a href="https://provable.com" target="_blank">
          <img src={aleoLogo} className="logo" alt="Aleo logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Aleo + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          <button onClick={generateAccount}>
            {account
              ? `Account private key is ${JSON.stringify(account)}`
              : `Click to generate account`}
          </button>
        </p>
        <p>
          <button disabled={executing} onClick={execute}>
            {executing
              ? `Executing...check console for details...`
              : `Execute helloworld.aleo`}
          </button>
        </p>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      {/* Advanced Section */}
      <div className="card">
        <h2>Advanced Actions</h2>
        <p>
          Deployment on Aleo requires certain prerequisites like seeding your
          wallet with credits and retrieving a fee record. Check README for more
          details.
        </p>
        <p>
          <button disabled={deploying} onClick={deploy}>
            {deploying
              ? `Deploying...check console for details...`
              : `Deploy helloworld.aleo`}
          </button>
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Aleo and React logos to learn more
      </p>
    </>
  );
}

export default App;
