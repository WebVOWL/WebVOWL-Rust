const process = require('process')
process.chdir("../../../../..")
const paths = require("./config.js").path_func;

describe("Truncating of text", function () {
	let tools;

	beforeEach(function () {
		tools = require(`${paths.backendPath}/js/util/textTools`)();
	});

	it("should not truncate too short strings", function () {
		let text = "The text length is OK",
			maxWidth = 1000;

		let truncatedText = tools.truncate(text, maxWidth);

		expect(truncatedText).toBe(text);
	});

	it("should truncate too long strings", function () {
		let text = "This text is too long",
			maxWidth = 4;

		let truncatedText = tools.truncate(text, maxWidth, null, 0);

		expect(truncatedText).not.toBe(text);
		expect(truncatedText.length).toBeLessThan(text.length);
	});

	it("should append three dots when truncating", function () {
		let text = "This text is waaaaaaaaaay too long",
			maxWidth = 100;

		let truncatedText = tools.truncate(text, maxWidth);

		expect(truncatedText).not.toBe(text);
		expect(truncatedText).toMatch(/.+\.\.\.$/);
	});
});
