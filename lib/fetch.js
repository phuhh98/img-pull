// Get html text and image buffer from sources

"use strict";

const axios = require("axios");
const fetchUrl = require("node-fetch");

let fetch = new Object(null);

//Fetch html text from url
fetch.source = async function fetchSource(url) {
	try {
		var result = await axios.get(url);
	} catch (err) {
		console.error(err);
	}

	let res = {
		html: result.data,
		originalUrl: result.request.res.responseUrl
	};
	return res;
}

//fetch image's binary from url
fetch.image = async function fetchImage(url) {
	const response = await fetchUrl(url);
	let buffer = await response.buffer();
	return buffer;
}

//convert base64 string back to binary
fetch.base64ToBuffer = function base64ToBuffer(base64_string) {
	return Buffer.from(base64_string, "base64");
}


module.exports = fetch;