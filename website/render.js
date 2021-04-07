const fs = require("fs"),
	yaml = require("js-yaml"),
	Handlebars = require("handlebars"),
	serviceberry = yaml.load(fs.readFileSync("api/serviceberry.yml", "utf8")),
	trunk = yaml.load(fs.readFileSync("api/trunk.yml", "utf8")),
	branch = yaml.load(fs.readFileSync("api/branch.yml", "utf8")),
	leaf = yaml.load(fs.readFileSync("api/leaf.yml", "utf8")),
	request = yaml.load(fs.readFileSync("api/request.yml", "utf8")),
	response = yaml.load(fs.readFileSync("api/response.yml", "utf8")),
	httperror = yaml.load(fs.readFileSync("api/httperror.yml", "utf8"));

Handlebars.registerPartial("arguments", fs.readFileSync("templates/arguments.hbs", "utf8"));
Handlebars.registerPartial("properties", fs.readFileSync("templates/properties.hbs", "utf8"));

var template = Handlebars.compile(fs.readFileSync("templates/doc.hbs", "utf8"));

createDoc(serviceberry);
createDoc(trunk);
createDoc(branch);
createDoc(leaf);
createDoc(request);
createDoc(response);
createDoc(httperror);

createContributing();

console.log("success");

function createDoc (doc) {
	doc.id = doc.name.toLowerCase().replace(/\W+/g, "-");
	doc.title = doc.name;

	if (typeof doc.constructor === "object") {
		doc.constructor.signature = doc.constructor.arguments.reduceRight(reduceArgsToSignature, "");
	}

	if (doc.methods) {
		doc.methods.forEach(setHash);
		doc.methods.forEach(method => processFunctionMeta(method));
	}

	if (doc.properties) {
		doc.properties.forEach(setHash);
		doc.properties.forEach(prop => processObjectMeta(prop));
	}

	fs.writeFileSync(`docs/${doc.id}-api.md`, template(doc));

	function processFunctionMeta (fn, indent = "") {
		if (fn.arguments) {
			fn.arguments.forEach(arg => processObjectMeta(arg, indent + "    "));
			fn.signature = fn.arguments.reduceRight(reduceArgsToSignature, "");
		}

		if (fn.signature) {
			fn.hash += fn.signature.replace(/[\[\]\s]+/g, "-")
				.replace(/[^\w-]/g, "")
				.replace(/\-+/g, "-")
				.toLowerCase();
		}
	}

	function processObjectMeta (object, indent = "") {
		object[object.type] = true;
		object.hasDefault = "default" in object;
		object.required = object.required !== false && !object.hasDefault;

		if (object.description) {
			object.description = object.description.replace(/^(?=.)/gm, indent).trim();
		}

		if (object.properties) {
			object.properties.forEach(prop => processObjectMeta(prop, indent));
		} else if (object.function) {
			processFunctionMeta(object, indent);
		}
	}

	function setHash (item) {
		item.hash = item.name.toLowerCase();
	}

	function reduceArgsToSignature (signature, arg, index) {
		var part = arg.name;

		if (arg.repeating) {
			part = "..." + part;
		}

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

function createContributing () {
	var contributing = fs.readFileSync("../CONTRIBUTING.md", "utf8");

	fs.writeFileSync("docs/contributing.md", "---\nid: contributing\ntitle: Contributing\n---\n\n" + contributing);
}
