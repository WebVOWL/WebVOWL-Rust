mod graph;

use graph::{build::build_graph, print::print_graph};

use grapher::{renderer::Renderer, simulator::SimulatorBuilder};

fn main() {
    let graph_container = build_graph();
    let graph_struct = graph_container.graph_struct;
    let graph = graph_container.graph;

    print_graph(&graph_struct, &graph);

    // * Configure the simulator */
    let simulator = SimulatorBuilder::new()
        .delta_time(0.005)
        .freeze_threshold(-1.0)
        .build(graph.into());

    // * Start the renderer */
    let renderer = Renderer::new(simulator);
    renderer.create_window();
}
