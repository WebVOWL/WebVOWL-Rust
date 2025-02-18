"use strict";
const paths = require("./config.js").path_func;
const path = require('path');
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
	cache: true,
	mode: 'production',
	entry: {
		webvowl: `./${paths.backendPath}/js/entry.js`,
		"webvowl.app": `./${paths.frontendPath}/js/entry.js`
	},
	output: {
		path: path.resolve(__dirname, paths.deployPath),
		publicPath: 'auto',
		filename: "js/[name].js",
		chunkFilename: "js/[chunkhash].js",
		// Fix Reference Error: https://stackoverflow.com/a/34361312
		library: {
			name: '[name]',
			type: 'assign',
		},
	},
	optimization: {
		minimize: false,
		minimizer: [
			new TerserPlugin({
				minify: TerserPlugin.uglifyJsMinify,
				// `terserOptions` options will be passed to `uglify-js`
				// Link to options - https://github.com/mishoo/UglifyJS#minify-options
				terserOptions: {},
			})
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
			{ patterns: [{ from: `${paths.frontendPath}/data/**/*`, to: `${paths.deployPath}/data` }] }
		),
		new MiniCssExtractPlugin({ filename: "css/[name].css" }),
		new webpack.ProvidePlugin({
			d3: "d3"
		})
	],
	externals: {
		"d3": "d3"
	}
};
