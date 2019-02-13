/* eslint max-nested-callbacks: ["error", 3] */

"use strict";

const Deserializer = require("../src/Deserializer"),
	{Readable} = require("stream");

describe("Deserializer", () => {
	var deserializer,
		text,
		json;

	beforeEach(() => {
		text = {
			type: "text/plain",
			string: "Hello Test!",
			handler: jasmine.createSpy("text handler")
		};

		json = {
			type: "application/json",
			// eslint-disable-next-line quotes
			string: '{"Hello":"Test!"}',
			handler: jasmine.createSpy("json handler")
		};

		deserializer = new Deserializer({
			[text.type]: text.handler,
			[json.type]: json.handler
		});
	});

	it("should call text/plain handler", async () => {
		const request = createRequest(text),
			response = {},
			result = undefined;

		await deserializer.deserialize(request, response);

		expect(request.content).toBe(text.string);
		expect(text.handler).toHaveBeenCalledWith(request, response, result);
		expect(text.handler).toHaveBeenCalledTimes(1);
	});

	it("should call application/json handler", async () => {
		const request = createRequest(json),
			response = {},
			result = undefined;

		await deserializer.deserialize(request, response);

		expect(request.content).toBe(json.string);
		expect(json.handler).toHaveBeenCalledWith(request, response, result);
		expect(json.handler).toHaveBeenCalledTimes(1);
	});

	it("should call result in raw content when no handler exists", async () => {
		const csv = {
				type: "text/csv",
				// eslint-disable-next-line quotes
				string: '"Hello","World!"'
			},
			request = createRequest(csv),
			response = {};

		deserializer = new Deserializer();

		await deserializer.deserialize(request, response);

		expect(request.content).toBe(csv.string);
	});
});

function createRequest (content) {
	var incomingMessage = new Readable(),
		request = {
			incomingMessage,
			getContentType: () => content.type
		};

	incomingMessage.push(content.string);
	incomingMessage.push(null);

	return request;
}
