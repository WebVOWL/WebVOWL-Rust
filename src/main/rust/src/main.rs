mod graph;

use std::{fs::File, io::BufReader};

use graph::{build::build_graph, data::OwlToWovlJSON, print::print_graph};

use grapher::simulator::SimulatorBuilder;

fn main() {
    let file_result = File::open("../data/muto.json");
    let file = match file_result {
        Ok(file) => file,
        Err(error) => panic!("Problem opening the file: {error:?}"),
    };
    let reader = BufReader::new(file);
    let graph_struct: OwlToWovlJSON = serde_json::from_reader(reader).unwrap();
    let graph_container = build_graph(graph_struct);
    let graph_struct = graph_container.graph_struct;
    let graph = graph_container.graph;

    print_graph(&graph_struct, &graph);

    // * Configure the simulator */
    let _simulator = SimulatorBuilder::new()
        .delta_time(0.005)
        .freeze_threshold(-1.0)
        .build(graph.into());

    // * Start the renderer */
    // let renderer = Renderer::new(simulator);
    // renderer.create_window();
}
