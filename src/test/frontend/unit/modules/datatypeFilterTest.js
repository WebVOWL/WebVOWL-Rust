const process = require('process')
process.chdir("../../../../..")
const paths = require("./config.js").path_func;

let OwlClass = require(`${paths.backendPath}/js/elements/nodes/implementations/OwlClass`);
let RdfsDatatype = require(`${paths.backendPath}/js/elements/nodes/implementations/RdfsDatatype`);
let DatatypeProperty = require(`${paths.backendPath}/js/elements/properties/implementations/OwlDatatypeProperty`);

describe("Collapsing of datatypes", function () {
	let filter;

	beforeEach(function () {
		jasmine.addMatchers({
			toBeInstanceOf: function () {
				return {
					compare: function (actual, expected) {
						return {
							pass: actual instanceof expected
						};
					}
				};
			}
		});
	});

	beforeEach(function () {
		filter = require(`${paths.backendPath}/js/modules/datatypeFilter`)();
		filter.enabled(true);
	});

	it("should remove datatypes with their properties", function () {
		let domain = new OwlClass(),
			datatypeProperty = new DatatypeProperty(),
			datatypeClass = new RdfsDatatype();

		datatypeProperty.domain(domain).range(datatypeClass);

		filter.filter([domain, datatypeClass], [datatypeProperty]);

		expect(filter.filteredNodes().length).toBe(1);
		expect(filter.filteredNodes()[0]).toBeInstanceOf(OwlClass);
		expect(filter.filteredProperties().length).toBe(0);
	});

});
