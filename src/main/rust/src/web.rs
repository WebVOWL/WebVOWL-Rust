use crate::{graph::build::build_graph, utils::set_panic_hook};
use petgraph::dot::Dot;
use wasm_bindgen::prelude::*;
use web_sys::Node;

// Called by our JS entry point to run the example.
#[wasm_bindgen]
pub fn run() -> Result<(), JsValue> {
    set_panic_hook();

    let graph_container = build_graph();
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
