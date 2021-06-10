const Image = require("../models/image")

//Controller to handle upload endpoint
const upload = (req, res) => {

  const arr = []
  var str = ''
  req.on('data', (chunk) => {

    arr.push(chunk)

    str += chunk.toString('utf-8')

  })

  req.on('end', () => {

    try{

      var jsonResponse = Image.upload(arr, str)

    }catch(err){

      res.writeHead(err[0], err[1])
      res.end(err[2].toString())

    }
    res.writeHead(200, {'content-type': 'application/json'})
    res.end(JSON.stringify(jsonResponse))

  })
 
}

//Controller to handle Write-message-on-image endpoint
const WriteMessageOnimage = (req, res) => {

  var jsonBody = {}
  var body = ''
  req.on('data', (chunk) => {

    body += chunk.toString()

  })

  req.on('end', () => {

    try{
      jsonBody = JSON.parse(body)
      const ext = jsonBody.path.slice(jsonBody.path.lastIndexOf('.'))
      //Check if the format match bmp
      if(ext !== '.bmp'){

        throw [417, 'Image format should be .bmp', 'Error: File should be in bmp format']

      }
      var jsonResponse = Image.encode(jsonBody.phrase, jsonBody.path)
      res.writeHead(200, {'content-type': 'application/json'})
      res.end(JSON.stringify(jsonResponse))
    }catch(err){

      res.writeHead(err[0], err[1])
      res.end(err[2].toString())

    }
  })
}

//Controller to handle decode-message-from-image endpoint
const decodeMessageFromImage = (req, res) => {

  try{
    const name = req.url.slice(req.url.lastIndexOf('/')+1)
    const ext = name.slice(name.lastIndexOf('.'))
    //Check if the format match bmp
    if(ext !== '.bmp'){

      throw [417, 'Image format should be .bmp', 'Error: File should be in bmp format']

    }
    const path = "./encoded/" + name
    var jsonResponse = Image.decode(path)

    
  }catch(err){

    res.writeHead(err[0], err[1])
    res.end(err[2].toString())

  }
  res.writeHead(200, {'content-type': 'application/json'})
  res.end(JSON.stringify(jsonResponse))

}

//Controller to handle get-image endpoint
const getImage = (req, res) => {

  const name = req.url.slice(req.url.lastIndexOf('/')+1)
  const path = "./encoded/" + name
  try{

    const ext = name.slice(name.lastIndexOf('.'))
    //Check if the format match bmp
    if(ext !== '.bmp'){

      throw [417, 'Image format should be .bmp', 'Error: File should be in bmp format']

    }
    var image = Image.get(path)
    
  }catch(err){

    res.writeHead(err[0], err[1])
    res.end(err[2].toString())

  }
  res.writeHead(200)
  res.end(image)

  
}

module.exports = {
    
  upload: upload,
  WriteMessageOnimage: WriteMessageOnimage,
  decodeMessageFromImage: decodeMessageFromImage,
  getImage: getImage
  

}