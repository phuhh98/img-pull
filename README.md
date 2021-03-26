# img-pull :pineapple::pineapple::pineapple:
Script to download image contain in <img> tag from url with constraint of file size

## Install

```bash
npm install --save img-pull
```

## Usage
### In javascript code
```javascript
const ipull =  new require("img-pull")();

ipull.pullSource(url, min_size, max_size);
```

### Execute script.js in terminal 
```bash
MIN_SIZE=0 MAX_SIZE=null URL=https://www.google.com node script.js #path to script.js
```

### Valid inputs
| Parameter | Format |
|------|------|
| url | string|
| min_size | number + unit {k,kb,m,mb,b,byte} |
| max_size | number + unit {k,kb,m,mb,b,byte} or "null"|