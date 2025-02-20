"use strict";
const paths = require("./config.js").path_func;
const path = require('path');
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
	cache: true,
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
		new CopyWebpackPlugin(
			{ patterns: [{ context: `${paths.frontendPath}/data`, from: "./*", to: `data` }] }
		),
		new MiniCssExtractPlugin({ filename: "css/[name].css" }),
		new webpack.ProvidePlugin({
			d3: "d3"
		})
	]
};
