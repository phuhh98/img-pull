//Fetch file take control of network function like get html
//source from input url and download image after filtering out
// image source inside <img> tags

const axios = require("axios");

let fetch = new Object(null);

// it just happen wrong inside node REPL 'cause test here use global variable - not good
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
// and return a Buffer object with that corespond binary data;
// need to check file size; __ in imgBuff
fetch.image = async function fetchImage(url) {
	let result = await axios.get(url) /*then( function (res) {
		return {html: res.data, originUrl: res.request.res.responseUrl}
	}).catch(err => console.error(err));*/
	return Buffer.from(result.data); 
}


module.exports = fetch;