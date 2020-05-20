"use strict";

const {freeze, base} = require("./class"),
	YieldableProxy = require("./YieldableProxy"),
	Deserializer = require("./Deserializer"),
	Serializer = require("./Serializer"),
	HttpError = require("./HttpError");

module.exports = freeze(base(class Director {
	#yieldProxies;
	#yielding;

	constructor (request, response) {
		const fail = this.fail.bind(this);

		// just in case
		request.incomingMessage.on("error", fail);
		response.serverResponse.on("error", fail);

		Object.assign(this, {request, response});
	}

	async run (route) {
		this.route = route;
		this.setTimer();
		this.response.on("serialize", this.serialize.bind(this));

		await this.deserialize();
		await this.proceed();
	}

	setTimer () {
		var {timeout} = this.route.options,
			timer;

		if (timeout) {
			timer = setTimeout(() => this.fail(new HttpError("Request timed out", "Service Unavailable")), timeout);
			this.response.on("finish", () => clearTimeout(timer));
		}
	}

	async deserialize () {
		const deserializer = new Deserializer(this.route.options.deserializers),
			[request, response] = this.getSerializationProxies();

		var result;

		try {
			result = await this.processResult(deserializer.deserialize(request, response));
		} catch (error) {
			result = new HttpError(error, error.status || "Bad Request");
		}

		this.#yieldProxies();
		this.request.setBody(result);
	}

	// eslint-disable-next-line consistent-return
	async proceed () {
		const handler = this.route.getNextHandler();

		if (handler) {
			await this.call(handler);
		} else if (this.response.notBegun()) {
			try {
				await this.response.send({
					body: this.request.latestResult
				});
			} catch (error) {
				await this.fail(error);
			}
		}

		if (this.response.notBegun()) {
			return this.proceed();
		}
	}

	async serialize (resolve, reject) {
		const serializer = new Serializer(this.route.options.serializers),
			[request, response] = this.getSerializationProxies();

		var finalizer = resolve,
			result;

		try {
			result = await this.processResult(serializer.serialize(request, response));
		} catch (error) {
			finalizer = reject;
			result = error;
		}

		this.#yieldProxies();
		finalizer(result);
	}

	async fail (error) {
		const coping = this.route.getNextCoping();

		if (this.#yieldProxies) {
			this.#yieldProxies();
		}

		error = new HttpError(error);
		this.request.error = error;

		if (coping) {
			await this.call(coping);
		} else {
			await this.sendError(error);
		}
	}

	async sendError (error) {
		try {
			await this.response.send({
				status: error.getStatus(),
				headers: error.getHeaders(),
				body: error.getMessage()
			});
		} catch (err) {
			const sendingError = new HttpError(err);

			await this.response.send({
				status: sendingError.getStatus(),
				headers: sendingError.getHeaders(),
				content: sendingError.getMessage()
			});
		}
	}

	getSerializationProxies () {
		const hiddenResponseMethods = ["send"];

		return this.getProxies(hiddenResponseMethods);
	}

	getProxies (hiddenResponseMethods = []) {
		const {yieldable: requestYieldable, proxy: request} = new YieldableProxy(
				this.request,
				["proceed", "fail"]
			),
			{yieldable: responseYieldable, proxy: response} = new YieldableProxy(
				this.response,
				["send"],
				hiddenResponseMethods
			);

		if (this.#yieldProxies) {
			this.#yieldProxies();
		}

		this.#yieldProxies = () => {
			requestYieldable.yield();
			responseYieldable.yield();
		};

		this.#yielding = requestYieldable.yielding;

		// once either proxy yields - remove control from both proxies
		Promise.race([
			requestYieldable.yielding,
			responseYieldable.yielding
		]).finally(this.#yieldProxies);

		return [request, response];
	}

	async call (handler) {
		const [request, response] = this.getProxies();

		var error;

		try {
			this.request.latestResult = await this.processResult(handler(request, response));
		} catch (err) {
			error = err;
		}

		this.#yieldProxies();

		if (error) {
			await this.fail(error);
		}
	}

	async processResult (result) {
		// if the handler didn't return a value use yielding instead
		// the yielding promise will resolve to the value passed to proceed
		if (typeof result === "undefined") {
			result = await this.#yielding;
		} else {
			result = await Promise.race([
				result,
				this.#yielding
			]);
		}

		if (result instanceof Error) {
			throw result;
		}

		return result;
	}
}));
