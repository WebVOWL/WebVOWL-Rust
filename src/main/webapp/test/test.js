import init, { run } from "../../rust/pkg/index.js";

// Regular wasm-bindgen initialization.
await init();

// Thread pool initialization with the given number of threads
// (pass `navigator.hardwareConcurrency` if you want to use all cores).
// await initThreadPool(navigator.hardwareConcurrency);


console.log("Starting")
run()
console.log("Code run")
