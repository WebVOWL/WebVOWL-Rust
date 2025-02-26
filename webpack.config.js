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
		front: `./${paths.frontendPath}/js/entry.js`,
		wasm: `./${paths.pkgPath}/index.js`
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
		// futureDefaults: true,
		// css: false,
		asyncWebAssembly: true
	},
	optimization: {
		minimize: false,
		minimizer: [
			new TerserPlugin({
				minify: TerserPlugin.uglifyJsMinify,
				// `terserOptions` options will be passed to `uglify-js`
				// https://github.com/mishoo/UglifyJS#minify-options
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
					{ from: "LICENSE", to: "." }
				]
			}
		),
		new MiniCssExtractPlugin({ filename: "css/[name].css" }),
		new WasmPackPlugin({
			crateDirectory: path.resolve(__dirname, paths.rustPath),
			// Check https://rustwasm.github.io/wasm-pack/book/commands/build.html for available set of arguments.
			args: '--verbose',
			extraArgs: '--no-typescript --target bundler --mode normal',
			forceMode: "production",
			pluginLogLevel: 'info'
		}),
	]
};
