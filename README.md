# WebVOWL Legacy
The WebVOWL legacy branch mirrors the [original WebVOWL](https://github.com/VisualDataWeb/WebVOWL) closely with the exception of some changes highligted below.


## Changes from the original WebVOWL

### Performance
> [!NOTE]
> Performance improvements given in seconds are measured using our reference machine:  
> Lenovo IdeaPad Gaming 3 15ARH05
> - CPU: Ryzen 5 4600H  
> - RAM: 32 GB  

TODO: Add testing ontology

- Loading an ontology is 60x faster
- Changing `degrees of collapse` (from 5 and up) is significantly faster (below 5 still takes >10 seconds)
- Rendering thousands of nodes is possible with 0.5-5 FPS

## Run Using Docker
Make sure you are inside `WebVOWL` directory and you have docker installed. Run the following command to build the docker image:

`docker build . -t webvowl:v1`

Run the following command to run WebVOWL at port 8080.

`docker-compose up -d`

Visit [http://localhost:8080](http://localhost:8080) to use WebVOWL.

## Requirements

Node.js for installing the development tools and dependencies.


## Development setup

### Simple
1. Download and install Node.js from http://nodejs.org/download/
2. Open the terminal in the root directory
3. Run `npm install` to install the dependencies and build the project
4. Run `npm run webserver` to start a local live-updating webserver with the current development version

Visit [http://localhost:3000](http://localhost:3000) to use WebVOWL.

### Advanced ###
1. Install Maven from https://maven.apache.org/download.cgi  
2. Instead of the last step of the simple setup, install the npm package `grunt-cli` globally with `npm install grunt-cli -g`.  
Now you can execute a few more advanced commands in the terminal:

* `mvn package` to build the project war file into the deploy directory (recommended over the grunt builds)
* `grunt` or `grunt release` builds the release files into the deploy directory
* `grunt package` builds the development version
* `grunt webserver` starts a local live-updating webserver with the current development version
* `grunt test` starts the test runner
* `grunt zip` builds the project and puts it into a zip file


Additional information
----------------------

To export the VOWL visualization to an SVG image, all css styles have to be included into the SVG code.
This means that if you change the CSS code in the `vowl.css` file, you also have to update the code that
inlines the styles - otherwise the exported SVG will not look the same as the displayed graph.

The tool which creates the code that inlines the styles can be found in the util directory. Please
follow the instructions in its [README](util/VowlCssToD3RuleConverter/README.md) file.
