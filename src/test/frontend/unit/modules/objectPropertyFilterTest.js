const process = require('process')
process.chdir("../../../../..")
const paths = require("./config.js").path_func;

let OwlClass = require(`${paths.backendPath}/js/elements/nodes/implementations/OwlClass`);
let OwlThing = require(`${paths.backendPath}/js/elements/nodes/implementations/OwlThing`);
let ObjectProperty = require(
	`${paths.backendPath}/js/elements/properties/implementations/OwlObjectProperty`);
let DatatypeProperty = require(
	`${paths.backendPath}/js/elements/properties/implementations/OwlDatatypeProperty`);
let Link = require(`${paths.backendPath}/js/elements/links/PlainLink`);

describe("Filtering of object properties", function () {
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
		filter = require(`${paths.backendPath}/js/modules/objectPropertyFilter`)();
		filter.enabled(true);
	});

	it("should remove object properties", function () {
		let domain = new OwlClass();
		let range = new OwlClass();
		let objectProperty = new ObjectProperty();

		objectProperty.domain(domain).range(range);

		filter.filter([domain, range], [objectProperty]);

		expect(filter.filteredNodes()).toEqual([domain, range]);
		expect(filter.filteredProperties().length).toBe(0);
	});

	it("should remove things without any other properties", function () {
		let domain = new OwlThing();
		let range = new OwlThing();
		let objectProperty = new ObjectProperty();

		objectProperty.domain(domain).range(range);
		let objectPropertyLink = new Link(domain, range, objectProperty);
		domain.links([objectPropertyLink]);
		range.links([objectPropertyLink]);

		filter.filter([domain, range], [objectProperty]);

		expect(filter.filteredNodes().length).toBe(0);
		expect(filter.filteredProperties().length).toBe(0);
	});

	it("should keep things with any other properties", function () {
		let domain = new OwlClass();
		let range = new OwlThing();
		let objectProperty = new ObjectProperty();
		let datatypeProperty = new DatatypeProperty();

		objectProperty.domain(domain).range(range);
		datatypeProperty.domain(domain).range(range);
		let objectPropertyLink = new Link(domain, range, objectProperty);
		let datatypePropertyLink = new Link(domain, range, datatypeProperty);
		domain.links([objectPropertyLink, datatypePropertyLink]);
		range.links([objectPropertyLink, datatypePropertyLink]);

		filter.filter([domain, range], [objectProperty, datatypeProperty]);

		expect(filter.filteredNodes()).toEqual([domain, range]);
		expect(filter.filteredProperties()).toEqual([datatypeProperty]);
	});
});
