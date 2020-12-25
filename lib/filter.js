/*Search pattern from html and validate input sizes
*/
"use strict";
class UserError extends Error {};
const filter = new Object(null);

//patterns
//input url
filter._url = /^(http|https)?:\/\/[^.]+?(\.[^.]+?)+?[^.]?$/i;
//input size
filter._size = /^(\d*)?(mb|kb|byte|.*?)?$/i;
//search pattern for <img> tag
filter._imgTag = /<img.*?src="(?:.*?)".*?>/gim;
//search pattern for src inside <img>
filter._relativePath = /src="(\/.*?)"/;
filter._base64String = /src="data:image\/.*?:base64,(.*?)"/;
filter._absolutePath = /src="(http[s]?:\/\/.*?)"/;

//url validation
filter.url = function urlCheck(url) {
    let testResult = this._url.test(url.trim(" "))
    if (!testResult) {
        throw new UserError("INVALID input url, check .env file or environment variables");
        return false;
    }
    return true;
}.bind(filter)

//size validation and return size in byte(s)
filter.size = function sizeCheck(size) {
    //input size is a string
    let match = size.trim(" ").match(this._size);
    let [sizeInByte, unit] = [match[1], match[2]];
    if (!sizeInByte) {
        throw new UserError("INVALID input size, check .env file or environment variables")
    }
    unit? unit = unit.toLowerCase() : unit = null;
    switch (unit) {
        case "kb":
            sizeInByte = sizeInByte*1024;
            break;
        case "mb":
            sizeInByte = sizeInByte*1024**2;
            break;
        default:
            sizeInByte = parseInt(sizeInByte);
            break;
    }
    return sizeInByte;
}.bind(filter);

//filter img tag from html
filter.imgTag = function imgTag(htmlString) {
    let imgArray = [];
    imgArray = htmlString.match(this._imgTag);
    return imgArray;
}.bind(filter);

//filter images source and return an object contain base64 string and absolute url
filter.imgSrc = function searchImageSource(imgTag) {

}.bind(filter);


module.exports = filter;