/*save images to local folder*/

"use strict";

const fs = require("fs");
const shortid = require("shortid");	//generate unique name
const FileType = require("file-type"); //check file type

let save = new Object(null);

//Images' folder path
save.path = "";

// Create ./images folder at current working directory
save.createSaveFolder = function createSaveFolder() {
	fs.mkdir("./images", (err, data) => console.log("\"/images\" has been created"));
	save.path = process.cwd() + "/images";
	console.log(save.path);
	return;
};

// Save image to ./images foler and return its saved path
save.image = function saveImage(imageBuffer) {
	return new Promise(async function(resolve, reject) {

		// returned format: {ext: "png", mime: "image/png" }
		var fileType = await FileType.fromBuffer(imageBuffer);

		if (!fileType || !fileType.mime.includes("image")) {
			reject("not an image");
			return;
		}
		console.log(fileType);
		var savedPath = save.path + "/" + shortid.generate() + "." + fileType.ext;

		//save input imageBuffer to disk
		fs.writeFile(savedPath, imageBuffer, function(err) {
			if (err) {
				reject(err);
			} else {
				resolve(savedPath);
			}
		});
	})
};


module.exports = save;

