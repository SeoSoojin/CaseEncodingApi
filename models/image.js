const fs = require('fs')

//Function to encode the message on a less important bit of each byte in the image
//BMP header occupies 54 bytes at most, that's why the message starts to be encoded at byte 54
//When you int divides a byte by 2 the rest are equal to the last bit in this byte
//That's because a number is odd if the last bit is 1 and even if the last bit is 0 (bit * 2^0)
//Doing "buffer[54 + cont] = buffer[54 + cont] - (-2*auxForByte.charAt(j) + 1)" we can save processing
//This is achieved by reducing one comparison for each byte, that's a LOT in bigger images
//Returns a JSON with the path for the encoded image 
const encode = (phraseRaw, path) => {

  let cont = 0

  try{
    var buffer = fs.readFileSync(path)
  }catch(err){

    if(err.code === 'ENOENT'){

      throw [404, 'File not found', err]

    }else{

      throw [400, 'Error', 'Error: Other errors']

    }


  }
  //Assure that the phrase of the message ends with '.'
  if(phraseRaw.lastIndexOf('.') === -1){

    phraseRaw = phraseRaw + '.'

  }
  const phrase = Buffer.from(phraseRaw)
  for(i = 0; i < phrase.length; i++){

    //Convert base 10 to binary and assure that this binary has at least 8 digits
    let auxForByte =  parseInt(phrase[i], 10).toString(2).padStart(8, '0')
    for(j = 0; j < 8; j++){
      
      if(buffer[54 + cont] % 2 != auxForByte.charAt(j)){
  
          buffer[54 + cont] = buffer[54 + cont] - (-2*auxForByte.charAt(j) + 1)
  
      }
      cont++
  
    }
    
  }
    const newPath = path.replace('.bmp','-encoded.bmp').replace('raw', 'encoded')
    try{
      fs.writeFileSync(newPath, buffer)
    }catch(err){

      if(err.code === 'ENOENT'){

        throw [404, 'File not found', err]
  
      }else{
  
        throw [400, 'Error', 'Error: Other errors']
  
      }
  

    }
    const jsonString = `{"path": "${newPath}"}`
    
    return JSON.parse(jsonString)

}

//Function to decode the message of an image
//Use the same premise as encoding, dividing a byte by 2 then taking the rest to get the last bit
//Then concat all the bits on groups of 8 to form the bytes
//Decode this bits using .fromCharCode() method and concat all of chars in a final string
//Returns a JSON with the message decoded
function decode(path){

  try{
   var buffer = fs.readFileSync(path)
  }catch(err){
  
    if(err.code === 'ENOENT'){

      throw [404, 'File not found', err]

    }else{

      throw [400, 'Error', 'Error: Other errors']

    }

  }
  var arr = []
  var arrAux= []
  var cont = 0
  var strFinal = ""
  var end = "00101110"
  

  for(i = 54; i < buffer.length; i++){

      arr.push(buffer[i] % 2)
      cont ++;
      if(cont === 8){

          arrAux.push(arr.join(''))
          if(arrAux.slice(-1) == end){

              break;
              
          }
          arr = []
          cont = 0;

      }

  }

  for(i = 0; i < arrAux.length; i++){

      var strAux = String.fromCharCode(parseInt(arrAux[i], 2))
      strFinal = strFinal.concat(strAux)
  }

  const jsonString = `{"message": "${strFinal}"}`

  return JSON.parse(jsonString)
  
}

//Function to handle and upload an image that was sent by multipart/form-data
//While loops calculate the byte sizes of the non-image content in the concatenated buffer
//This maths uses the fact that when encoded to hex each byte occupies 2 indexes + the padding between the encoded buffer lines
//Then convert the concatenated buffer to hex and slice the useless bytes (while taking the filename to save processing)
//Convert this again to a buffer and save it on the temp dir of the server
function upload(arr, str){

  const bufferStr = Buffer.concat(arr).toString('hex')
  const arrBuff = str.split('\r\n')
  var sizePos = 0
  var sizePre = 0
  var flag = 0
  var pow = 0
  var filename = ''
  while(flag === 0){

    pow++
    let aux = Buffer.from(arrBuff.pop()).length * 2
    if(aux != 0){
      sizePos += aux
      flag = 1
      pow++
    }

  }
  sizePos +=  Math.pow(2, pow)
  flag = 0
  pow = 0
  while(flag === 0){

    pow++
    let strAux = arrBuff.shift()
    let aux = Buffer.from(strAux).length * 2
    if(aux === 0){
      flag = 1
    }else{
      if(strAux.includes('filename="')){

        filename = strAux.slice(strAux.indexOf('filename="')+10, strAux.lastIndexOf('"'))
      }
      sizePre += aux
    }

  }
  sizePre +=  Math.pow(2, pow)
  const bufferFinal = Buffer.from(bufferStr.slice(sizePre, -sizePos), 'hex')
  const path = `./raw/${filename}`

  try{
    fs.writeFileSync(path, bufferFinal)
  }catch(err){

    if(err.code === 'ENOENT'){

      throw [404, 'Folder not found', err]

    }else{

      throw [400, 'Error', 'Error: Other errors']

    }


  }

  const jsonString = `{"path": "${path}"}`

  return JSON.parse(jsonString)

}

//Simple function to return a buffer from a given path
function get(path){

  try{
     
    var image = fs.readFileSync(path)

  }catch(err){

    if(err.code === 'ENOENT'){

      throw [404, 'Folder not found', err]

    }else{

      throw [400, 'Error', 'Error: Other errors']

    }

  }
  return image
}


module.exports = {

    encode: encode,
    decode: decode,
    upload: upload,
    get: get,

}