"use strict";

module.exports = {
	projectName: "Serviceberry",
	title: "Serviceberry",
	tagline: "A simple HTTP service framework for Node.js",
	url: "https://serviceberry.js.org",
	baseUrl: "/",
	headerLinks: [{
		label: "Guides",
		doc: "getting-started"
	}, {
		label: "API Reference",
		doc: "serviceberry"
	}, {
		label: "Blog",
		blog: true
	}],
	headerIcon: "img/serviceberry-horizontal.svg",
	favicon: "img/favicon.ico",
	colors: {
		primaryColor: "#2b1100",
		secondaryColor: "#7e7e7e"
	},
	organizationName: "bob-gray",
	highlight: {
		theme: "agate",
	},
	repoUrl: "https://github.com/bob-gray/serviceberry",
	customDocsPath: "website/docs",
	scripts: [
		"https://buttons.github.io/buttons.js"
	]
};
