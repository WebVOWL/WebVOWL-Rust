use crate::{
    graph::build::build_graph,
    utils::{read_web_file, set_panic_hook},
};
use petgraph::dot::Dot;
use wasm_bindgen::prelude::*;
use web_sys::{Node, console};

// Called by our JS entry point to run the example.
#[wasm_bindgen]
pub fn run(web_file: web_sys::File) -> Result<(), JsValue> {
    set_panic_hook();
    console::log_1(&JsValue::from_str("This works in Rust"));
    let graph_container = build_graph(read_web_file(web_file));
    let graph_string = Dot::new(&graph_container.graph);

    let window = web_sys::window().expect("Global 'window' does not exist");
    let document = window.document().expect("window should have a document");
    let section = document
        .get_element_by_id("canvasArea")
        .expect("canvasArea not found on section");
    let p: Node = document.create_element("p")?.into();
    p.set_text_content(Some(
        format!("Hello from Rust, WebAssembly, and Webpack! Here's the graph:\n{graph_string:?}")
            .as_str(),
    ));
    section.append_child(&p)?;
    Ok(())
}
