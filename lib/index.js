/*This file is intentionally create to connect
other modules inside /lib folder*/
const fetch = require("./fetch.js");
const filter = require("./filter.js");
const save = require("./save.js");

class ImagePull {
	constructor () {}

	async pullSource(url, min_size, max_size) {
		//Check validity of url;
		if ( !filter.url(url) ) {
			return;
		}

		// Check input size validity and convert size to number in byte
		min_size = filter.size(min_size) | 0 ;
		max_size = filter.size(min_size) | null;
		
		//Fetch source data { html::String, originalUrl::String }
		let data = await fetch.source(url);
		/*Extract image source from html response
		imageSources = {
			relativePath::Array[String],
			absolutePath::Array[String],
			base64String::Array[String]
		}*/
		let imageSources  = filter.imgSrc( filter.imgTag(data.html) );

		//Add originalUrl to relativePath
		imageSources.relativePath = imageSources.relativePath.map(function(relativePath) {
			return data.originalUrl + relativePath;
		})

		// Condense absolute and relative paths to one property of imageSources
		imageSources.paths = [];
		imageSources.paths.push(...imageSources.relativePath, ...imageSources.absolutePath);
		delete imageSources.relativePath;
		delete imageSources.absolutePath;

		// image buffers container
		let imageBuffers = new Array();
				
		for (let path of imageSources.paths) {
			let tempBuffer = await fetch.image(path);
			console.log(tempBuffer);
			if ( filter.checkSize(tempBuffer, min_size, max_size) ) {
				imageBuffers.push(tempBuffer);
			};
		}

		// convert base64 string to buffer data
		for (let base64String of imageSources.base64String) {
			let tempBuffer = fetch.base64ToBuffer();
			if ( filter.checkSize(tempBuffer, min_size, max_size) ) {
				imageBuffers.push(tempBuffer);
			};
		}


		//Create ./images folder to save files
		save.createSaveFolder();
		for (let buffer of imageBuffers) {
			let savedPath = save.image(buffers);
			console.log(savedPath);
		}

		return;
	}

}


module.exports = ImagePull;

/*
0. take user input link and check for its validity
1. fetch html from source
2. extract imagesource _include both path and base64String
3. fetch image buffer from source and transform base64String to Buffer
4. save buffer image data to local folder
*/