/*terminal usage example:
MIN_SIZE=0byte MAX_SIZE=null URL=https://www.google.com node script.js
*/
"use strict";
const ImagePull = require("./lib/index.js");
let ipull =  new ImagePull();
let url = process.env.URL,
	min_size = process.env.MIN_SIZE,
	max_size = process.env.MAX_SIZE;

ipull.pullSource(url, min_size, max_size);