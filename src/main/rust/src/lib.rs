// #[cfg(feature = "parallel")]
pub use wasm_bindgen_rayon::init_thread_pool;
mod graph;
mod io;
mod parser;
mod utils;
mod web;
