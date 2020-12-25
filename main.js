/*This is where the code exports.
   Main feature: download all images from a url with predefined size or not
   methods:
      ipull.all(url , foldername = "download"]) --> download and store images in destination folder, return a list of images' paths
      ipull.size(url , minsize = 0, maxsize = null) --> like above but with arange of predefined size

*/
"use strict";
require("dotenv").config();

modules.exports.all = function noSize(url, folderName = "download") {

    return [];
}

modules.exports.size = function withSize(url, folderName = "download", minSize = 0, maxSize = null) {
    return [];
}