"use strict";

// using object literal should guarantee toString is native Object.prototype method
const {toString} = {};

function deepMerge (target, ...sources) {
	// eslint-disable-next-line eqeqeq
	sources = sources.filter(source => source != null);

	if (getObjectString(target) !== "Object") {
		throw new Error("deepMerge target must be an object");
	}

	if (sources.some(source => getObjectString(source) !== "Object")) {
		throw new Error("deepMerge sources must be an object, null, or undefined");
	}

	return sources.reduce(defineProperties, target);
}

function defineProperties (target, source) {
	const properties = Object.getOwnPropertyDescriptors(source);

	// Arrays don't usually make sense as a mix of target and source
	// so we never mix them to be consistent
	if (Array.isArray(target)) {
		target.length = 0;
	}

	Object.forEach(properties, property => {
		const type = getObjectString(property.value);

		if (type === "Array" || type === "Object") {
			property.value = defineProperties(
				Object.setPrototypeOf(getInitialValue(type), Object.getPrototypeOf(property.value)),
				property.value
			);
		}
	});

	return Object.defineProperties(target, properties);
}

function getObjectString (value) {
	return toString.call(value).slice(8, -1);
}

function getInitialValue (type) {
	var initial;

	if (type === "Array") {
		// This is important for augmented array objects
		// if they start as object literals, Array.isArray() returns false
		// even if they're prototype chain contains Array.prototype
		initial = [];
	} else if (type === "Object") {
		initial = {};
	}

	return initial;
}

module.exports = deepMerge;
