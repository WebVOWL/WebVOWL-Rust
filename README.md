# WebVOWL
This is a fork of WebVOWL which focuses on addressing the slow performance of the original WebVOWL in an effort to make WebVOWL great again.

## Run using Docker
Make sure you are inside the `WebVOWL` directory and you have docker installed.  
Run `docker build . -t webvowl:v1` to build the docker image.  
Run `docker-compose up -d` to start the WebVOWL server at port 8080.  
Visit [http://localhost:8080](http://localhost:8080) to use WebVOWL.

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
