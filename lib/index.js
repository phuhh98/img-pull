/*This file is intentionally create to connect
other modules inside /lib folder and export ImagePull class*/
"use strict";

const fetch = require("./fetch.js");
const filter = require("./filter.js");
const save = require("./save.js");

class ImagePull {
	constructor () {}

	async pullSource(url, min_size = 0, max_size = "null") {
		// valid url :: string
		// valid min_size :: number + valid units {k,kb,m,mb,b,byte}
		// valid max_size :: number + valid units {k,kb,m,mb,b,byte} or null
		
		if (!url) {
			console.error("url is missing");
			return;
		}

		//Check validity of url;
		if ( !filter.url(url) ) {
			return;
		}
		
		// Check input size validity and convert size to number in byte
		min_size = filter.size(min_size) | 0 ;
		if (max_size != "null") {
			max_size = filter.size(max_size);
		}
		
		//Fetch source data { html::String, originalUrl::String }
		let data = await fetch.source(url);
		/*Extract image source from html response
		imageSources = {
			relativePath::Array[String],
			absolutePath::Array[String],
			base64String::Array[String]
		}*/
		console.log( filter.imgTag(data.html));

		let imgTagList = filter.imgTag(data.html);
		if (!imgTagList) {
			console.log("found no images or incompatible web platform");
			return;
		}
		// Classify image sources with {} of [] of sources
		let imageSources  = filter.imgSrc( imgTagList );

		// Convert relativePath to absolutePath by adding originalUrl
		imageSources.relativePath = imageSources.relativePath.map(function(relativePath) {
			if (data.originalUrl.endsWith("/")) {
				return data.originalUrl + relativePath.slice(1);
			}
			return data.originalUrl + relativePath;
		})

		// Combine 2 [] to 1 [] after convert to absolutePath
		imageSources.paths = [];
		imageSources.paths.push(...imageSources.relativePath, ...imageSources.absolutePath);
		delete imageSources.relativePath;
		delete imageSources.absolutePath;
		console.log(imageSources.paths);
		// Images' buffers container
		let imageBuffers = [];
		
		//console.log(imageSources);

		// Download buffer images -push->> imageBuffers[]	
		for (let path of imageSources.paths) {
			//console.log(path);
			let tempBuffer = await fetch.image(path);
			if ( filter.checkSize(tempBuffer, min_size, max_size) ) {
				imageBuffers.push(tempBuffer);
			};
		}

		// Convert base64 string --> buffer -push->> imageBuffers
		for (let base64String of imageSources.base64String) {
			let tempBuffer = fetch.base64ToBuffer();
			if ( filter.checkSize(tempBuffer, min_size, max_size) ) {
				imageBuffers.push(tempBuffer);

			};
		}
		//console.log(imageBuffers);
		
		//Create ./images folder to save files
		save.createSaveFolder();
		for (let buffer of imageBuffers) {
			try {
				var savedPath = await save.image(buffer);
			} catch (err) {
				console.error(err);
			}
			console.log("image saved at ", savedPath)
		}

		return;
	}

}


module.exports = ImagePull;

/*
0. take user input url and check for its validity
1. fetch html from source
2. extract imageSources _include both path (url) and base64String
3. fetch image buffer from source and transform base64String to Buffer
4. save buffer image data to current directory
*/