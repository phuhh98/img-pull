/*Search pattern from html and validate input sizes
*/
"use strict";

//exporting object of this file
const filter = new Object(null);

//REGEX patterns for
// Validating user input url
filter._url = /^(http[s]?:)?\/\/[^.]+?(\.[^.]+?)+?[^.]?$/i;
// Validating user input file size
filter._size = /(\d*)?(m|mb|k|kb|b|byte|.*?)?/i;
// Extracting <img> tags from html response
filter._imgTag = /<img.*?src="(?:.*?)".*?>/gim;
// Filtering out image source from an <img> tag
    //Relavtive path with orgininal url from <img> tag
filter._relativePath = /src="(\/[^/].*?)"/; // regex are alright
    //Absolute url from an <img> tag
filter._absolutePath = /src="(http[s]?:\/\/.*?)"/;
filter._absoluteSubDomain = /src="(\/\/.*?)"/;
    //Base64 string buffer in <img> tag
filter._base64String = /src="data:image\/.*?:base64,(.*?)"/;

//memo for page's protocol
filter.originalProtocol = "" ;

//check user input url using to pull image from
filter.url = function urlCheck(url) {
    let testResult = filter._url.test(url.trim(" "))
    if (!testResult) {
        throw new UserError("INVALID input url, check .env file or environment variables");
        return false;
    }
    
    //assign original url at the first run
    if (!filter.originalProtocol) {
        filter.originalProtocol = url.match(filter._url)[1];
    }

    return true;
}

//check for the user input size (MAX and MIN size)
filter.size = function sizeCheck(size) {
    //Case input size is a number _ return it in byte as default unit
    if ( Number.isInteger(size)) {
        return size;
    }

    //Case input size is a string
    // Split input size into number and unit and store them in match[]
    // with pattern define in filter_size regex
    let match = size.trim(" ").match(this._size);
    let [sizeInByte, unit] = [match[1], match[2]];
    
    if (!sizeInByte) {
        throw new Error("INVALID input size");
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

//Extract image tags from html and return imgTagList[]
filter.imgTag = function imgTag(htmlString) {
    let imgTagList = [];
    imgTagList = htmlString.match(filter._imgTag);
    return imgTagList;

}

//Filter out image source as url or base64 string from image tags
// and return {} with [] of each type of sources
filter.imgSrc = function searchImageSource(imgTagList) {
    let imageSource = {
        relativePath: new Set(),
        absolutePath: new Set(),
        base64String: new Set(),
    };

    imgTagList.forEach(function(imgTag) {
        if (filter._relativePath.test(imgTag) == true) {
            //relativePath -push->> imageSource.relativePath[]
            imageSource.relativePath.add(imgTag.match(filter._relativePath)[1]);
            return;

        } else if (filter._absolutePath.test(imgTag) == true) {
            //absolutePath -push->> imageSource.absolute[]
            imageSource.absolutePath.add(imgTag.match(filter._absolutePath)[1]);
                                                    /*bug right here .^. */
            return;

        } else if (filter._absoluteSubDomain.test(imgTag) == true) {
            // found subDomain path + prepend protocol http/https -push->> imageSource.absolute[]
            imageSource.absolutePath.add( filter.originalProtocol + imgTag.match(filter._absoluteSubDomain)[1])

            return;

        } else if (filter._base64String.test(imgTag) == true) {
            //base64String -push->> imageSource.base64String[]
            imageSource.base64String.add(imgTag.match(filter._base64String)[1]);
            return;

        } else {
            return;
        }
    })

    for (let list in imageSource) {
        //change Set instances in imageSource{} to Array __ easier to use in later iterations;
        imageSource[list] = Array.from(imageSource[list]);
    }

    return imageSource;
}

filter.checkSize = function checkBufferSize(buffer, min_size, max_size) {
    // buffer is in buffer type
    // valid input of min_size :: number + validUnit {k,kb,m,mb,b,byte}
    // valid input of max_size :: number + validUnit {k,kb,m,mb,b,byte} or null
    
    let size = buffer.byteLength;
    //Case that min_size, and max_size is omitted by user from the beginning
    if ( min_size === 0 && max_size === null ) {
        return true;
    }

    //Case both two got inputed value
    if ( min_size != 0  && max_size != null ) {
        if ( size >= min_size && size <= max_size) {
            return true;
        }
    }

    //Case one of the two is omitted
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
