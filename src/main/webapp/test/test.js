// import { path_func } from '../../../../config.js';
// import init, { initThreadPool, run } from `../${paths.pkgPath}/index.js`;

// const paths = path_func

// CHECKOUT: https://webpack.js.org/guides/code-splitting/

import init, { initThreadPool, run } from "../../rust/pkg/index.js";

// Regular wasm-bindgen initialization.
await init();

// Thread pool initialization with the given number of threads
// (pass `navigator.hardwareConcurrency` if you want to use all cores).
await initThreadPool(navigator.hardwareConcurrency);


window.addEventListener("load", () => {
    run()
})