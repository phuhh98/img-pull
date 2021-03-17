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
		if (max_size != null) {
			max_size = filter.size(max_size);
		}
		console.log(min_size, max_size);
		
		//Fetch source data { html::String, originalUrl::String }
		let data = await fetch.source(url);
		/*Extract image source from html response
		imageSources = {
			relativePath::Array[String],
			absolutePath::Array[String],
			base64String::Array[String]
		}*/
		console.log( filter.imgTag(data.html));
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

		// Image buffers container
		let imageBuffers = [];
		
		console.log(imageSources);

		// Fetch images to imageBuffers container from url	
		for (let path of imageSources.paths) {
			console.log(path);
			let tempBuffer = await fetch.image(path);
			if ( filter.checkSize(tempBuffer, min_size, max_size) ) {
				imageBuffers.push(tempBuffer);
			};
		}

		// Convert base64 string to buffer data
		for (let base64String of imageSources.base64String) {
			let tempBuffer = fetch.base64ToBuffer();
			if ( filter.checkSize(tempBuffer, min_size, max_size) ) {
				imageBuffers.push(tempBuffer);

			};
		}
		console.log(imageBuffers);
		//Create ./images folder to save files
		save.createSaveFolder();
		for (let buffer of imageBuffers) {
			let savedPath = await save.image(buffer);
			console.log("image saved at ", savedPath)
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