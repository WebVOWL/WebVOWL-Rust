"use strict";
const paths = require("./config.js").path_func;
const path = require('path');
const webpack = require("webpack");
const merge = require('webpack-merge');
const express = require("express");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin')


function getConfig(args) {
	const isProdEnabled = args.mode === "production" ? true : false;
	const modeLiteral = args.mode === "production" ? "production" : "development";
	return {
		cache: true,
		mode: modeLiteral,
		entry: {
			// back: `./${paths.backendPath}/js/entry.js`,
			// front: `./${paths.frontendPath}/js/entry.js`,
			test: {
				import: [
					`./${paths.webappPath}/test/test.js`
				],
				// dependOn: "wasm"
			},
			// wasm: `./${paths.pkgPath}/index.js`
		},
		output: {
			path: path.resolve(__dirname, paths.deployPath),
			publicPath: 'auto',
			filename: "js/[name].js",
			chunkFilename: "js/[chunkhash].js",
			webassemblyModuleFilename: 'wasm/[id].[hash].wasm',
			enabledWasmLoadingTypes: ['fetch'],
			workerChunkLoading: "universal",
			globalObject: 'this',
			module: true
			// library: {
			// 	name: 'webvowl',
			// 	type: 'umd',
			// },
		},
		experiments: {
			// futureDefaults: true,
			// css: false,
			outputModule: true,
			asyncWebAssembly: true
		},
		optimization: {
			// splitChunks: {
			// 	chunks: 'all',
			// },
			// runtimeChunk: 'single',
			minimize: isProdEnabled,
			minimizer: [
				new TerserPlugin({
					minify: TerserPlugin.uglifyJsMinify,
					// `terserOptions` options will be passed to `uglify-js`
					// https://github.com/mishoo/UglifyJS#minify-options
					terserOptions: { sourceMap: isProdEnabled },
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
				{
					// Fixes: BREAKING CHANGE: The request '../../..' failed to resolve only because it was resolved as fully specified
					// See: https://stackoverflow.com/q/70964723
					test: /\.m?js/,
					resolve: {
						fullySpecified: false,
					},
				}
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
				// For available set of arguments check:
				// https://rustwasm.github.io/wasm-pack/book/commands/build.html
				// https://github.com/wasm-tool/wasm-pack-plugin
				args: '--verbose',
				extraArgs: '--no-typescript --target web --mode normal',
				forceMode: modeLiteral,
				outDir: "pkg",
				pluginLogLevel: 'info'
			}),
		]
	};
};

function getServerConfig(args) {
	// Checkout
	// https://webpack.js.org/concepts/hot-module-replacement/
	// https://webpack.js.org/configuration/dev-server/#devserverapp
	return {
		devServer: {
			app: () => express(),
			allowedHosts: 'auto',
			compress: true,
			host: "local-ip",
			headers: {
				"cache-control": "no-store, no-cache, must-revalidate, max-age=0",
				"Cross-Origin-Resource-Policy": "cross-origin",
				"Cross-Origin-Opener-Policy": "same-origin",
				"Cross-Origin-Embedder-Policy": "require-corp"
			},
			client: {
				overlay: {
					errors: true,
					warnings: false,
					runtimeErrors: true,
				},
				logging: 'info',
				progress: true,
				reconnect: 3,
			},
			// Checkout https://github.com/webpack/webpack-dev-middleware
			devMiddleware: {
				index: true,
				mimeTypes: { phtml: 'text/html' },
				publicPath: '/publicPathForDevServe',
				serverSideRender: true,
				writeToDisk: true,
			},
		},
	}
}



// webpack config example  https://github.com/webpack-contrib/grunt-webpack/issues/153
// Merging webpacks https://github.com/survivejs/webpack-merge
// Grunt webpack https://github.com/webpack-contrib/grunt-webpack
module.exports = (args) => {
	switch (args.type) {
		case "devserver":
			return merge(getConfig(args), getServerConfig(args));
		default:
			return getConfig(args);
	}
};
