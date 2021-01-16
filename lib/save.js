/*This file is used to save file into current local folder*/

const fs = require("fs");
const shortid = require("shortid");

let save = new Object(null);

//File saved folder path
save.path = "";

// Create ./images folder at current working directory to save images
save.createSaveFolder = function createSaveFolder() {
	fs.mkdir("./images", (err, data) => console.log("\"/images\" has been created"));
	this.path = process.cwd() + "/images";
	return;
}.bind(save);

// Save image to ./images foler and return its saved path

// Still not working??/???????????
save.image = function saveImage(imageBuffer) {
	//create a unique file name with shortid
	let savedPath = save.path + "/" + shortid.generate();

	console.log(this.path);
	//save input imageBuffer into a file
	fs.writeFileSync(savedPath, imageBuffer);
	
	return savedPath;
}.bind(save);


module.exports = save;

