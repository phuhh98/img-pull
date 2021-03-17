/*Search pattern from html and validate input sizes
*/
"use strict";
class UserError extends Error {};

//exporting object of this file
const filter = new Object(null);

//REGEX patterns for
//Validating user input url
filter._url = /^(http[s]?)?:\/\/[^.]+?(\.[^.]+?)+?[^.]?$/i;
//Validating user input file size
filter._size = /(\d*)?(m|mb|k|kb|b|byte|.*?)?/i;
//Extracting <img> tags from html response
filter._imgTag = /<img.*?src="(?:.*?)".*?>/gim;
//Filtering out image source from an <img> tag
    //Relavtive path with orgininal url from <img> tag
filter._relativePath = /src="(\/.*?)"/; // regex are alright
    //Absolute url from an <img> tag
filter._absolutePath = /src="(http[s]?:\/\/.*?)"/;
    //Base64 string buffer in <img> tag
filter._base64String = /src="data:image\/.*?:base64,(.*?)"/;


//check user input url using to pull image from
filter.url = function urlCheck(url) {
    let testResult = this._url.test(url.trim(" "))
    if (!testResult) {
        throw new UserError("INVALID input url, check .env file     or environment variables");
        return false;
    }
    return true;
}.bind(filter)

//check for the user input size (MAX and MIN size)
filter.size = function sizeCheck(size) {
    // input size is a number_ default it's in byte
    if ( Number.isInteger(size)) {
        return size;
    }

    //input size is a string
    let match = size.trim(" ").match(this._size);
    let [sizeInByte, unit] = [match[1], match[2]];
    if (!sizeInByte) {
        throw new UserError("INVALID input size, check .env file or environment variables")
    }
    unit ? unit = unit.toLowerCase() : unit = null;
    switch (unit) {
        case "k":
            sizeInByte = sizeInByte*1024;
			break;
		case "kb":
			sizeInByte = sizeInByte*1024;
			break;		
        case "m":
            sizeInByte = sizeInByte*1024**2;
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

//Extract image tags from the responsed html
filter.imgTag = function imgTag(htmlString) {
    let imgTagList = [];
    imgTagList = htmlString.match(filter._imgTag);
    return imgTagList;

}

//Filter out image source as url or base64 string from image tags
// and return a container object with three Array for Source
filter.imgSrc = function searchImageSource(imgTagList) {
    let imageSource = {
        relativePath: new Set(),
        absolutePath: new Set(),
        base64String: new Set(),
    };

    imgTagList.forEach(function(imgTag) {
        if (filter._relativePath.test(imgTag) == true) {
            //Push matched path to imageSource.relativePath list
            imageSource.relativePath.add(imgTag.match(filter._relativePath)[1]);
            return;
        } else if (filter._absolutePath.test(imgTag) == true) {
            //Push matched absolute path to imageSource.absolute list
            imageSource.absolutePath.add(imgTag.match(filter._absolutePath)[1]);
                                                    /*bug right here .^. */
            return;
        } else if (filter._base64String.test(imgTag) == true) {
            //Push base64String to imageSource.base64String list
            imageSource.base64String.add(imgTag.match(filter._base64String)[1]);
            return;
        } else {
            return;
        }
    })

    for (let list in imageSource) {
        imageSource[list] = Array.from(imageSource[list]);
    }

    return imageSource;
}

filter.checkSize = function checkBufferSize(buffer, min_size, max_size) {
    let size = buffer.byteLength;
    //min_size, and max_size is omitted by user from the beginning
    if ( min_size === 0 && max_size === null ) {
        return true;
    }

    // Both two got inputed value
    if ( min_size != 0  && max_size != null ) {
        if ( size >= min_size && size <= max_size) {
            return true;
        }
    }

    // One of the two is omitted
    if ( min_size != 0 && max_size == null ) {
        if ( size >= min_size) {
            return true;
        }
    }

    if ( min_size == 0 && max_size != null) {
        if ( size <= max_size) {
            return true;
        }
    }

    return false;
}


module.exports = filter;
