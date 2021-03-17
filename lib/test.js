const ImagePull = require("./index.js");
ipull = new ImagePull();
console.log(ipull);
const url ="https://www.greytrix.com/blogs/sagex3/2016/07/14/how-to-create-a-stock-count-in-sage-x3" ;
ipull.pullSource(url, 0, null)

// next one is to fix the minSize and maxSize filter