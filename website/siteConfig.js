"use strict";

module.exports = {
	title: "Serviceberry",
	tagline: "A focused HTTP service framework for Node.js",
	url: "https://serviceberry.js.org",
	baseUrl: "/",
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
	cleanUrl: true,
	disableHeaderTitle: true,
	algolia: {
		apiKey: "d8f71d3fca61a88437ddb93081120da2",
		indexName: "serviceberry"
	},
	gaTrackingId: "UA-116036661-1",
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
		theme: "agate"
	},
	ogImage: "img/serviceberry.svg",
	twitter: true,
	customDocsPath: "website/docs",
	scripts: [
		"https://buttons.github.io/buttons.js"
	]
};
