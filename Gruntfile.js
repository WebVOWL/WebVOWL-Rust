"use strict";
const paths = require("./config.js").path_func;
module.exports = function (grunt) {
	require("load-grunt-tasks")(grunt);
	let webpackConfig = require("./webpack.config.js");

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		clean: {
			deploy: paths.deployPath,
			testOntology: paths.deployPath + "/data/benchmark.json",
			redundantFolders: "pkg"
		},
		connect: {
			devserver: {
				options: {
					protocol: "http",
					hostname: "localhost",
					port: 8000,
					base: paths.deployPath,
					directory: paths.deployPath,
					livereload: true,
					open: "http://localhost:8000/",
					middleware: function (connect, options, middlewares) {
						return middlewares.concat([
							require("serve-favicon")(`${paths.deployPath}/favicon.ico`),
							require("serve-static")(options.base[0])
						]);
					}
				}
			}
		},
		htmlbuild: {
			options: {
				beautify: true,
				relative: true,
				data: {
					// Data to pass to templates
					version: "<%= pkg.version %>"
				}
			},
			dev: {
				src: `${paths.webappPath}/index.html`,
				dest: paths.deployPath
			},
			release: {
				// required for removing the benchmark ontology from the selection menu
				src: `${paths.webappPath}/index.html`,
				dest: paths.deployPath
			}
		},
		karma: {
			options: {
				configFile: `${paths.testPath}/karma.conf.js`
			},
			dev: {},
			continuous: {
				singleRun: true
			}
		},
		replace: {
			options: {
				patterns: [
					{
						match: "WEBVOWL_VERSION",
						replacement: "<%= pkg.version %>"
					}
				]
			},
			dist: {
				files: [
					{ expand: true, cwd: `${paths.deployPath}/js/`, src: "webvowl*.js", dest: "." }
				]
			}
		},
		webpack: {
			options: webpackConfig,
			build: {},
			"build-dev": {
				mode: "development",
				devtool: "source-map"
			}
		},
		watch: {
			// configs: {
			// 	files: ["Gruntfile.js"],
			// 	options: {
			// 		reload: true
			// 	}
			// },
			// js: {
			// 	files: [`${paths.frontendPath}/**/*.js`, `${paths.backendPath}/**/*.js`], // TODO: Remove backend files when JS has been rewritten to Rust
			// 	tasks: ["webpack:build-dev", "post-js"],
			// 	options: {
			// 		livereload: true,
			// 		spawn: false
			// 	}
			// },
			// html: {
			// 	files: [`${paths.webappPath}/**/*.html`],
			// 	tasks: ["htmlbuild:dev"],
			// 	options: {
			// 		livereload: true,
			// 		spawn: false
			// 	}
			// }
		}
	});
	grunt.registerTask("default", ["release"]);
	grunt.registerTask("pre-js", ["clean:deploy"]);
	grunt.registerTask("post-js", ["replace"]);
	grunt.registerTask("package", ["pre-js", "webpack:build-dev", "clean:redundantFolders", "post-js", "htmlbuild:dev"]);
	grunt.registerTask("release", ["pre-js", "webpack:build", "clean:redundantFolders", "post-js", "htmlbuild:release", "clean:testOntology"]);
	grunt.registerTask("webserver", ["package", "connect:devserver", "watch"]);
	grunt.registerTask("test", ["karma:dev"]);
	grunt.registerTask("test-ci", ["karma:continuous"]);
};
