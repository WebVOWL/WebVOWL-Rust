# WebVOWL Rust
> [!NOTE]
> We are developing two flavours of WebVOWL: [WebVOWL Rust](https://github.com/WebVOWL/WebVOWL/tree/rust) and [WebVOWL Legacy](https://github.com/WebVOWL/WebVOWL/tree/legacy)

This branch tracks development of WebVOWL Rust, which is a total rewrite of WebVOWL in Rust. 

The rewrite must satisfy the following:
- The GUI must be similar to the [original WebVOWL](https://github.com/VisualDataWeb/WebVOWL)

## Run using Docker
TBD

## Development setup
1. Install Maven from https://maven.apache.org/download.cgi
2. Install Rust from https://www.rust-lang.org/tools/install
3. Run `cargo install wasm-pack`

Next, make sure you are inside the `WebVOWL` directory.
Now you can:
- Run `mvn package` to build the project
- Run `mvn package -P dev-server` to start a local webserver with the current development version

## Additional information
To export the VOWL visualization to an SVG image, all css styles have to be included into the SVG code. This means that if you change the CSS code in the `vowl.css` file, you also have to update the code that inlines the styles - otherwise the exported SVG will not look the same as the displayed graph.

The tool which creates the code that inlines the styles can be found in the util directory. Please follow the instructions in its [README](util/VowlCssToD3RuleConverter/README.md) file.
