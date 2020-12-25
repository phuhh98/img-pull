/*This is where the execution code be call in terminal with node
command:  URL=url MIN_SIZE=minSize[kb|mb|byte|] MAX_SIZE=maxSize[kb|mb] FOLDER=downloadFolder node ipull.js
can customize by adding .env file to use for environment variables
*/
"use strict";
//load environment variable from .env file if exist
require("dotenv").config();
const EventEmitter = require("events");
const ipull = require("main.js");

let runTimeEvent = new EventEmitter();


function main() {
    let url, minSize, maxSize, folder;
    //check environment varibale and assign them to use
    process.env.URL ? url = process.env.URL : throw new Error("Url is missing");
    process.env.MIN_SIZE ? minSize = process.env.MIN_SIZE : minSize = 0; // need method to validate size
    process.env.MAX_SIZE ? maxSize = process.env.MAX_SIZE : maxSize = null;
    process.env.DES_FOlDER ? folder = process.env.FOlDER : folder = "download";

    if ( minSize === 0 && maxSize === null ) {
        ipull.all(url, folder);
    } else {
        ipull.size(url, folder, minSize, maxSize);
    }
    return;
}


try {
    main();
} catch(err) {
    console.error(err);
} finally(err) {
    err ? process.exit(1) : process.exit(0);
}