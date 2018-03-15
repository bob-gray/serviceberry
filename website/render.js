const fs = require("fs"),
	yaml = require("js-yaml"),
	Handlebars = require("handlebars"),
	serviceberry = yaml.safeLoad(fs.readFileSync("api/serviceberry.yml", "utf8")),
	trunk = yaml.safeLoad(fs.readFileSync("api/trunk.yml", "utf8")),
	branch = yaml.safeLoad(fs.readFileSync("api/branch.yml", "utf8")),
	leaf = yaml.safeLoad(fs.readFileSync("api/leaf.yml", "utf8")),
	request = yaml.safeLoad(fs.readFileSync("api/request.yml", "utf8")),
	response = yaml.safeLoad(fs.readFileSync("api/response.yml", "utf8")),
	httperror = yaml.safeLoad(fs.readFileSync("api/httperror.yml", "utf8")),
	args = Handlebars.registerPartial("arguments", fs.readFileSync("templates/arguments.hbs", "utf8")),
	properties = Handlebars.registerPartial("properties", fs.readFileSync("templates/properties.hbs", "utf8")),
	template = Handlebars.compile(fs.readFileSync("templates/doc.hbs", "utf8"));

createDoc(serviceberry);
createDoc(trunk);
createDoc(branch);
createDoc(leaf);
createDoc(request);
createDoc(response);
createDoc(httperror);

function createDoc (doc) {
	doc.id = doc.name.toLowerCase().replace(/\W+/g, "-");
	doc.title = doc.name;

	/*if (doc.constructor && doc.constructor.arguments) {
		doc.constructor.signature = doc.constructor.arguments.map(arg => arg.name).join(", ");
		doc.constructor.arguments.forEach(arg => arg.required !== false);
	}*/

	if (doc.methods) {
		doc.methods.forEach(setHash);
		doc.methods.forEach(processFunctionMeta);
	}

	if (doc.properties) {
		doc.properties.forEach(setHash);
		doc.properties.forEach(processObjectMeta);
	}

	fs.writeFileSync(`docs/${doc.id}-api.md`, template(doc));

	function processFunctionMeta (fn) {
		if (fn.arguments) {
			fn.arguments.forEach(processObjectMeta);
			fn.signature = fn.arguments.reduceRight(reduceArgsToSignature, "");
		}

		if (fn.signature) {
			fn.hash += fn.signature.replace(/\s+/g, "-")
				.replace(/[^\w-]/g, "")
				.toLowerCase();
		}
	}

	function processObjectMeta (object) {
		object[object.type] = true;
		object.hasDefault = "default" in object;
		object.required = object.required !== false && !object.hasDefault;

		if (object.properties) {
			object.properties.forEach(processObjectMeta);
		} else if (object.function) {
			processFunctionMeta(object);
		}
	}

	function setHash (item) {
		item.hash = item.name.toLowerCase();
	}

	function reduceArgsToSignature (signature, arg, index) {
		var part = arg.name;

		if (index) {
			part = ", " + part;
		}

		if (!arg.required) {
			signature = "[" + part + signature + "]";
		} else {
			signature = part + signature;
		}

		return signature;
	}
}