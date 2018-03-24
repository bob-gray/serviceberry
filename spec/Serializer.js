"use strict";

const Serializer = require("../src/Serializer");

describe("Serializer", () => {
	var serializer,
		text,
		json;

	beforeEach(() => {
		text = {
			type: "text/plain",
			result: "Hello Test!"
		};

		text.handler = jasmine.createSpy("text handler").and.returnValue(text.result);

		json = {
			type: "application/json",
			result: '{"Hello":"Test!"}'
		};

		json.handler = jasmine.createSpy("json handler").and.returnValue(json.result);

		serializer = new Serializer({
			[text.type]: text.handler,
			[json.type]: json.handler
		});
	});

	it("should call text/plain handler", () => {
		const request = {},
			response = createResponse(text),
			result = serializer.serialize(request, response);

		expect(result).toBe(text.result);
		expect(text.handler).toHaveBeenCalledWith(request, response);
		expect(text.handler).toHaveBeenCalledTimes(1);
	});

	it("should call application/json handler", () => {
		const request = {},
			response = createResponse(json),
			result = serializer.serialize(request, response);

		expect(result).toBe(json.result);
		expect(json.handler).toHaveBeenCalledWith(request, response);
		expect(json.handler).toHaveBeenCalledTimes(1);
	});

	it("should call result in raw content when no handler exists", async () => {
		const csv = {
				type: "text/csv",
				result: '"Hello","World!"'
			},
			serializer = new Serializer(),
			request = {},
			response = createResponse(csv),
			result = serializer.serialize(request, response);

		expect(result).toBe(csv.result);
	});
});

function createResponse (body) {
	return {
		getContentType: () => body.type,
		getBody: () => body.result
	};
}
