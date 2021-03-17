/*This file is used to save file into current local folder*/

const fs = require("fs");
const shortid = require("shortid");

let save = new Object(null);

//File saved folder path
save.path = "";

// Create ./images folder at current working directory to save images
save.createSaveFolder = function createSaveFolder() {
	fs.mkdir("./images", (err, data) => console.log("\"/images\" has been created"));
	save.path = process.cwd() + "/images";
	console.log(save.path);
	return;
};

// Save image to ./images foler and return its saved path
save.image = function saveImage(imageBuffer) {
	return new Promise( function(resolve, reject) {
		//create a unique file name with shortid
		let savedPath = save.path + "/" + shortid.generate();
		//console.log(savedPath);
		//save input imageBuffer into a file
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

