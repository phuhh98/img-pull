# img-pull
 # download all pictures from a url with a predefined picture minimum size in KB or MB [default = 0] and max size and foldername
 # could be use from terminal with node command and input arguments URL MIN_SIZE and MAX_SIZE
  # check process.argv and process.env if (dotENV module to load from file) and put it to main.js function arguments
  # use shortId to generate random images' names, also a variable to verify existed name
 
 
### nodejs modules: fs, util
### user modules: axios, dotENV, shortID

## structure:
   main.js   --> modules export
   run.js    --> terminal running script check .env file or process.env or process.argv and feed to main function
      /lib/
         filter.js   --> support method search matches from input string
         fetch.js    --> do network jobs: download page source, download imgs
         save.js     --> use fs for saving images

   [.env]
      

# process.env.MIN_SIZE pattern
sizeFilter = /(\d*)?[(mb|kb|byte|.*?)?]/i
# check url is ok
urlFilter = /([?:(http|https)]:\/\/)/i 

# use to search from html for img tag
imgFilter = /<img.*?src="(.*?)".*?>/gim


# cases when filterd
# use to match relative path in img's src attribute
relativePath = /src="(\/.*?)"/
  # append this path to original url, fetch img, copy to buffer, check minimum size, save to file

# use to match img's src attribute for base64 string
string64 = /src="data:image\/.*?:base64,(.*?)"/
  #afterward, use:
    Buffer.from("text", "base64")
  # check minimum buffer size, if pass
  # save to a file using fs stream

# use to match img's src for absolute path / uri
absolute = /src="(http[s]?:\/\/.*?)"/
  # fetch img from src with axios, copy to buffer obj, check minimum size, then save to files
