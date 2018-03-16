"use strict";

module.exports = {
	title: "Serviceberry",
	tagline: "A simple HTTP service framework for Node.js",
	url: "https://bob-gray.github.io",
	baseUrl: "/serviceberry/",
	cname: "serviceberry.js.org",
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
	onPageNav: "separate",
	repoUrl: "https://github.com/bob-gray/serviceberry",
	organizationName: "bob-gray",
	projectName: "serviceberry",
	highlight: {
		theme: "agate",
	},
	customDocsPath: "website/docs",
	scripts: [
		"https://buttons.github.io/buttons.js"
	]
};
