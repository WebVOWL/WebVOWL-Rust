use super::data::OwlToWovlJSON;
use petgraph::{Graph, dot::Dot};

/// Print the graph to stdout
pub fn print_graph(graph_struct: &OwlToWovlJSON, graph: &Graph<String, ()>) {
    println!(
        "{:?} == {:?}",
        graph_struct.propertyAttribute.len(),
        graph_struct.property.len()
    );
    println!("{:?}", Dot::new(&graph));
}
