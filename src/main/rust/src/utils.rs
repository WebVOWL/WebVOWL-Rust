use std::io::{BufReader, Bytes};
use wasm_bindgen::{JsCast, JsValue};
use wasm_bindgen_file_reader::WebSysFile;
use wasm_bindgen_futures::JsFuture;

use crate::graph::data::OwlToWovlJSON;

pub fn set_panic_hook() {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function at least once during initialization, and then
    // we will get better error messages if our code ever panics.
    //
    // For more details see
    // https://github.com/rustwasm/console_error_panic_hook#readme
    console_error_panic_hook::set_once();
}

pub fn read_web_file(web_file: web_sys::File) -> OwlToWovlJSON {
    // * Read the JSON file */
    // https://www.reddit.com/r/rust/comments/pdxa09/accessing_file_data_from_wasm/
    // https://rustwasm.github.io/wasm-bindgen/examples/fetch.html
    // https://github.com/Badel2/wasm-bindgen-file-reader
    // https://github.com/rustwasm/wasm-bindgen/issues/1727
    //

    let file = WebSysFile::new(web_file);
    let reader = BufReader::new(file);
    return serde_json::from_reader(reader).unwrap();

    //     let bytes: Bytes = match JsFuture::from(web_file.array_buffer()).await {
    //         Ok(value) => {
    //             JsFuture::from(JsCast::dyn_into(value).expect("reference should be valid"));
    //         }
    //         Err(_) => {}
    //     };
}
