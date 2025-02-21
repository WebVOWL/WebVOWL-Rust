var paths = require("./config.js").path_func;
var path = require("path");
var webpack = require("webpack");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	cache: true,
	entry: {
		webvowl: `./${paths.backendPath}/js/entry.js`,
		"webvowl.app": `./${paths.frontendPath}/js/entry.js`
	},
	output: {
		path: path.join(__dirname, paths.deployPath),
		publicPath: "",
		filename: "js/[name].js",
		chunkFilename: "js/[chunkhash].js",
		libraryTarget: "assign",
		library: "[name]"
	},
	module: {
		loaders: [
			{ test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") }
		]
	},
	plugins: [
		new CopyWebpackPlugin([
			{ context: paths.frontendPath, from: "data/**/*" }
		]),
		new ExtractTextPlugin("css/[name].css"),
		new webpack.ProvidePlugin({
			d3: "d3"
		})
	],
	externals: {
		"d3": "d3"
	}
};
