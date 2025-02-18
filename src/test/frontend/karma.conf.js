const ChromiumRevision = require('puppeteer/package.json').puppeteer.chromium_revision
const Downloader = require('puppeteer/utils/ChromiumDownloader')
const revisionInfo = Downloader.revisionInfo(Downloader.currentPlatform(), ChromiumRevision)

process.env.CHROME_BIN = revisionInfo.executablePath

module.exports = function (config) {
	config.set({
		basePath: "../",
		frameworks: ["jasmine"],
		files: [
			"node_modules/d3/d3.js",
			"test/unit/index.js"
		],
		preprocessors: {
			"test/unit/index.js": ["webpack"]
		},
		reporters: ["spec"],
		browsers: ['ChromeHeadless'],
		plugins: [
			require("karma-jasmine"),
			require("karma-chrome-launcher"),
			require("karma-spec-reporter"),
			require("karma-webpack")
		],
		webpack: {
			resolve: {
				extensions: ["", ".js"]
			}
		},
		webpackMiddleware: {
			noInfo: true
		},
		singleRun: false
	});
};
