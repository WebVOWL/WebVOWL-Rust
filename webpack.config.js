"use strict";
const paths = require("./config.js").path_func;
const path = require('path');
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin')

module.exports = {
	cache: true,
	mode: "production",
	entry: {
		back: `./${paths.backendPath}/js/entry.js`,
		front: `./${paths.frontendPath}/js/entry.js`
	},
	output: {
		path: path.resolve(__dirname, paths.deployPath),
		publicPath: 'auto',
		filename: "js/[name].js",
		chunkFilename: "js/[chunkhash].js",
		enabledWasmLoadingTypes: ['fetch'],
		globalObject: 'this',
		library: {
			name: 'webvowl',
			type: 'umd',
		},
	},
	experiments: {
		asyncWebAssembly: true
	},
	optimization: {
		minimize: false,
		minimizer: [
			new TerserPlugin({
				minify: TerserPlugin.uglifyJsMinify,
				// `terserOptions` options will be passed to `uglify-js`
				// Link to options - https://github.com/mishoo/UglifyJS#minify-options
				terserOptions: { sourceMap: true },
			}),
			new CssMinimizerPlugin()
		],
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
				],
			},
		],
	},
	plugins: [
		new webpack.ProvidePlugin({
			d3: "d3"
		}),
		new CopyWebpackPlugin(
			{
				patterns: [
					{ context: paths.dataPath, from: "./*", to: `data` },
					{ context: paths.webappPath, from: "favicon.ico", to: "." },
					{ from: "license.txt", to: "." }
				]
			}
		),
		new MiniCssExtractPlugin({ filename: "css/[name].css" }),
		new WasmPackPlugin({
			crateDirectory: path.resolve(__dirname, paths.rustPath),

			// Check https://rustwasm.github.io/wasm-pack/book/commands/build.html for
			// the available set of arguments.

			// Optional space delimited arguments to appear before the wasm-pack
			// command. Default arguments are `--verbose`.
			args: '--log-level verbose',
			// Default arguments are `--typescript --target browser --mode normal`. --no-typescript
			extraArgs: '--typescript --target bundler --mode normal',

			// Optional array of absolute paths to directories, changes to which
			// will trigger the build.
			// watchDirectories: [
			// 	path.resolve(__dirname, paths.rustPath)
			// ],

			// The same as the `--out-dir` option for `wasm-pack`
			outDir: paths.pgkPath,

			// The same as the `--out-name` option for `wasm-pack`
			// outName: "index",

			// If defined, `forceWatch` will force activate/deactivate watch mode for
			// `.rs` files.
			//
			// The default (not set) aligns watch mode for `.rs` files to Webpack's
			// watch mode.
			// forceWatch: true,

			// If defined, `forceMode` will force the compilation mode for `wasm-pack`
			//
			// Possible values are `development` and `production`.
			//
			// the mode `development` makes `wasm-pack` build in `debug` mode.
			// the mode `production` makes `wasm-pack` build in `release` mode.
			forceMode: "production",

			// Controls plugin output verbosity, either 'info' or 'error'.
			// Defaults to 'info'.
			pluginLogLevel: 'info'
		}),
	]
};
