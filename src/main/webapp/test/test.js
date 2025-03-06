import init, { run } from "../../rust/pkg/index.js";

// Regular wasm-bindgen initialization.
await init();

// Wasm workers: https://github.com/sgasse/wasm_worker_interaction
// Simplify web workers: https://github.com/GoogleChromeLabs/comlink

// Thread pool initialization with the given number of threads
// (pass `navigator.hardwareConcurrency` if you want to use all cores).
// await initThreadPool(navigator.hardwareConcurrency);


console.log("Starting")
var input = document.createElement('input');
input.type = 'file';

input.onchange = e => {
    var file = e.target.files[0];
    run(file)
    console.log("Code run")
}
var canvas_section = document.getElementById("canvasArea")
canvas_section.insertBefore(input, canvas_section.firstChild)
