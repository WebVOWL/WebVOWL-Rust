//Std stuff
use std::collections::HashMap;
use std::fs::File;
use std::io::BufReader;
use std::io::Error;

//Grapher
use grapher::renderer::Renderer;
use grapher::simulator::SimulatorBuilder;

//Petgraph
use petgraph::Graph;
use petgraph::dot::Dot;
use petgraph::graph;
use petgraph::visit::NodeRef;

//Serde
use serde::{Deserialize, Serialize};
use serde_json::{Result, Value};

/* ||||||||||||||||||||||||||| */
/* ||||||||  STRUCTS  |||||||| */
/* ||||||||||||||||||||||||||| */

// & Main Struct (Head of the JSON)
#[derive(Serialize, Deserialize, Debug)]
struct OwlToWovlJSON {
    _comment: String,
    header: Header,
    namespace: Option<Vec<String>>,
    metrics: Option<Metrics>,
    class: Vec<Class>,
    classAttribute: Vec<ClassAttribute>,
    property: Vec<Property>,
    propertyAttribute: Vec<PropertyAttribute>,
}

// & Level 1
#[derive(Serialize, Deserialize, Debug)]
struct Header {
    languages: Vec<String>,
    baseIris: Vec<String>,
    title: Title,
    iri: String,
    version: String,
    author: Vec<String>,
    description: Description,
    labels: Label,
    other: Other,
}
#[derive(Serialize, Deserialize, Debug)]
struct Metrics {
    classCount: u32,
    objectPropertyCount: u32,
    datatypePropertyCount: u32,
    individualCount: u32,
}
#[derive(Serialize, Deserialize, Debug)]
struct Class {
    id: String,
    r#type: String,
}
#[derive(Serialize, Deserialize, Debug)]
struct ClassAttribute {
    iri: Option<String>,
    baseIri: Option<String>,
    instances: Option<u32>,
    annotations: Option<Annotations>,
    label: Option<Label>,
    subClasses: Option<Vec<String>>,
    comment: Option<Label>,
    attributes: Option<Vec<String>>,
    id: String,
    superClasses: Option<Vec<String>>,
}
#[derive(Serialize, Deserialize, Debug)]
struct Property {
    id: String,
    r#type: String,
}
#[derive(Serialize, Deserialize, Debug)]
struct PropertyAttribute {
    iri: Option<String>,
    inverse: Option<String>,
    baseIri: Option<String>,
    range: String,
    annotations: Option<Annotations>,
    label: Option<Label>,
    superproperty: Option<Vec<String>>,
    domain: String,
    subproperty: Option<Vec<String>>,
    comment: Option<Label>,
    attributes: Option<Vec<String>>,
    id: String,
}

// & Level 2
#[derive(Serialize, Deserialize, Debug)]
struct Title {
    undefined: String,
}
#[derive(Serialize, Deserialize, Debug)]
struct Description {
    undefined: String,
}
#[derive(Serialize, Deserialize, Debug)]
struct Label {
    // ^ Struct for both labels and comments
    #[serde(rename = "IRI-based")]
    IRI_based: Option<String>,
    undefined: Option<String>,
    en: Option<String>,
}
#[derive(Serialize, Deserialize, Debug)]
struct Other {
    licence: Vec<ILVT>,
    creator: Vec<ILVT>,
    versionInfo: Vec<ILVT>,
    title: Vec<ILVT>,
    issued: Vec<ILVT>,
    seeAlso: Vec<ILVT>,
    homepage: Vec<ILVT>,
    depiction: Vec<ILVT>,
}
#[derive(Serialize, Deserialize, Debug)]
struct Annotations {
    isDefinedBy: Option<Vec<ILVT>>,
    versionInfo: Option<Vec<ILVT>>,
}

// & Level 3
#[derive(Serialize, Deserialize, Debug)]
struct ILVT {
    identifier: String,
    language: String,
    value: String,
    r#type: String,
}

fn main() {
    // * Read the JSON file */
    let file = File::open("./src/modified.json").unwrap();
    let reader = BufReader::new(file);
    let graph_struct: OwlToWovlJSON = serde_json::from_reader(reader).unwrap();

    // * Create the graph */
    let mut graph = Graph::<String, ()>::new();

    //Hashmap is necessary to store the nodes references with their new ids
    let mut hashmap = HashMap::new();

    for edge in &graph_struct.propertyAttribute {
        let domain_node_id = edge.domain.clone();
        let range_node_id = edge.range.clone();
        let dom_index;
        let ran_index;

        // * Check if the node already exists */
        // * If it does, get the index        */
        // * If it doesn't, create the node   */
        let opt_dm_index = hashmap.get(&domain_node_id);
        match opt_dm_index {
            Some(&x) => {
                dom_index = x;
            }
            None => {
                dom_index = graph.add_node(domain_node_id.clone());
                hashmap.insert(domain_node_id, dom_index);
            }
        }

        let opt_rn_index = hashmap.get(&edge.range);
        match opt_rn_index {
            Some(&x) => {
                ran_index = x;
            }
            None => {
                ran_index = graph.add_node(range_node_id.clone());
                hashmap.insert(range_node_id, ran_index);
            }
        }
        graph.add_edge(dom_index, ran_index, ());
    }

    // ! Debugging stuff
    println!(
        "{:?} == {:?}",
        graph_struct.class.len(),
        graph_struct.metrics.as_ref().unwrap().objectPropertyCount
    );
    println!(
        "{:?} == {:?}",
        graph_struct.propertyAttribute.len(),
        graph_struct.property.len()
    );
    println!("{:?}", Dot::new(&graph));

    // * Configure the simulator */
    let simulator = SimulatorBuilder::new()
        .delta_time(0.01)
        .freeze_threshold(-1.0)
        .build(graph.into());

    // * Start the renderer */
    let renderer = Renderer::new(simulator);
    // renderer.create_window();
}
