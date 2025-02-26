# WebVOWL [![Build Status](https://travis-ci.org/VisualDataWeb/WebVOWL.svg?branch=master)](https://travis-ci.org/VisualDataWeb/WebVOWL)


This repository was ported from an internal SVN repository to Github after the release of WebVOWL 0.4.0. Due to cleanups with `git filter-branch`, the commit history might show some strange effects.

## Run Using Docker
Make sure you are inside `WebVOWL` directory and you have docker installed. Run the following command to build the docker image:

`docker build . -t webvowl:v1`

Run the following command to run WebVOWL at port 8080.

`docker-compose up -d`

Visit [http://localhost:8080](http://localhost:8080) to use WebVOWL.

## Development setup

### Simple
1. Install Maven from https://maven.apache.org/download.cgi
2. Install Rust from https://www.rust-lang.org/tools/install
3. Run `cargo install wasm-pack`

### Advanced
1. Follow the [simple setup](#Simple)
2. Install Node.js from http://nodejs.org/download/
3. Install the npm package `grunt-cli` globally with `npm install grunt-cli -g`

Now you can execute a few more advanced commands in the terminal:
- `npm run test` starts the test runner
- `npm run server` starts a local webserver with the current development version

## Trouble shooting

### Rust-wasm
Issue:
> Module not found: Error: Can't resolve 'env' in '/src/main/rust/pkg'

Solution:
> https://github.com/rustwasm/wasm-bindgen/discussions/3500#discussioncomment-6334669


## Additional information
To export the VOWL visualization to an SVG image, all css styles have to be included into the SVG code.
This means that if you change the CSS code in the `vowl.css` file, you also have to update the code that
inlines the styles - otherwise the exported SVG will not look the same as the displayed graph.

The tool which creates the code that inlines the styles can be found in the util directory. Please
follow the instructions in its [README](util/VowlCssToD3RuleConverter/README.md) file.
