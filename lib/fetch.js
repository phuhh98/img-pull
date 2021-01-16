//Fetch file take control of network function like get html
//source from input url and download image after filtering out
// image source inside <img> tags

const axios = require("axios");
const fetchUrl = require("node-fetch");

let fetch = new Object(null);

//Fetch html from input URL
fetch.source = async function fetchSource(url) {
	let result = await axios.get(url) /*then( function (res) {
		return {html: res.data, originUrl: res.request.res.responseUrl}
	}).catch(err => console.error(err));*/
	let res = {
		html: result.data,
		originalUrl: result.request.res.responseUrl
	};
	return res;
}

//Fetch image data from url
// and return a Buffer object with that corresponding binary data;
// need to check file size; __ in imgBuff
fetch.image = async function fetchImage(url) {
	const response = await fetchUrl(url);
	let buffer = await response.buffer();
	return buffer;
}

fetch.base64ToBuffer = function base64ToBuffer(base64_string) {
	return Buffer.from(base64_string, "base64");
}


module.exports = fetch;