"use strict";
import { paths } from "config";

module.exports = function (grunt) {
	require("load-grunt-tasks")(grunt);
	let webpack = require("webpack");
	let webpackConfig = require("./webpack.config.js");

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		bump: {
			options: {
				files: ["package.json"],
				updateConfigs: ["pkg"],
				commit: true,
				commitMessage: "Bump version to %VERSION%",
				commitFiles: ["package.json"],
				createTag: false,
				prereleaseName: "RC",
				push: false
			}
		},
		clean: {
			deploy: paths.deployPath,
			zip: "webvowl-*.zip",
			testOntology: paths.deployPath + "data/benchmark.json"
		},
		compress: {
			deploy: {
				options: {
					archive: function () {
						let branchInfo = grunt.config("gitinfo.local.branch.current");
						return "webvowl-" + branchInfo.name + "-" + branchInfo.shortSHA + ".zip";
					},
					level: 9,
					pretty: true
				},
				files: [
					{ expand: true, cwd: "deploy/", src: ["**"], dest: "webvowl/" }
				]
			}
		},
		// connect: {
		// 	devserver: {
		// 		options: {
		// 			protocol: "http",
		// 			hostname: "localhost",
		// 			port: 8000,
		// 			base: paths.deployPath,
		// 			directory: paths.deployPath,
		// 			livereload: true,
		// 			open: "http://localhost:8000/",
		// 			middleware: function (connect, options, middlewares) {
		// 				return middlewares.concat([
		// 					require("serve-favicon")("deploy/favicon.ico"),
		// 					require("serve-static")(options.base[0])
		// 				]);
		// 			}
		// 		}
		// 	}
		// },
		copy: {
			dependencies: {
				files: [
					{ expand: true, cwd: `${paths.nodeModulePath}/d3/`, src: ["d3.min.js"], dest: paths.deployPath + "/js/" }
				]
			},
			static: {
				files: [
					{ expand: true, cwd: paths.webappPath, src: ["favicon.ico"], dest: paths.deployPath },
					{ expand: true, src: ["license.txt"], dest: paths.deployPath }
				]
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
		jshint: {
			options: {
				jshintrc: true
			},
			source: [`${paths.webappPath}/**/*.js`],
			tests: [`${testPath}/*/**/*.js`]
		},
		karma: {
			options: {
				configFile: `${testPath}/karma.conf.js`
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
					{ expand: true, cwd: "deploy/js/", src: "webvowl*.js", dest: "deploy/js/" }
				]
			}
		},
		webpack: {
			options: webpackConfig,
			build: {
				plugins: webpackConfig.plugins.concat(
					// minimize the deployed code
					new webpack.optimize.UglifyJsPlugin(),
					new webpack.optimize.DedupePlugin()
				)
			},
			"build-dev": {
				devtool: "sourcemap",
				debug: true
			}
		},
		watch: {
			configs: {
				files: ["Gruntfile.js"],
				options: {
					reload: true
				}
			},
			js: {
				files: [`${paths.frontendPath}/**/*`, `${paths.backendPath}/**/*`], // TODO: Remove backend files when JS has been rewritten to Rust
				tasks: ["webpack:build-dev", "post-js"],
				options: {
					livereload: true,
					spawn: false
				}
			},
			html: {
				files: [`${paths.webappPath}/**/*.html`],
				tasks: ["htmlbuild:dev"],
				options: {
					livereload: true,
					spawn: false
				}
			}
		}
	});

	grunt.registerTask("default", ["release"]);
	grunt.registerTask("pre-js", ["clean:deploy", "clean:zip", "copy"]);
	grunt.registerTask("post-js", ["replace"]);
	grunt.registerTask("package", ["pre-js", "webpack:build-dev", "post-js", "htmlbuild:dev"]);
	grunt.registerTask("release", ["pre-js", "webpack:build", "post-js", "htmlbuild:release", "clean:testOntology"]);
	grunt.registerTask("zip", ["gitinfo", "release", "compress"]);
	// grunt.registerTask("webserver", ["package", "connect:devserver", "watch"]);
	grunt.registerTask("test", ["karma:dev"]);
	grunt.registerTask("test-ci", ["karma:continuous"]);
};
