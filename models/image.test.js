const Image = require('./image.js')
const fs = require('fs')
const {it, expect} = require('../utils/Tdd.js')

it('Get an image stream', () => {

    const path = './encoded/test-encoded.bmp'
    const exp = ''
    const res = Image.get(path)
    expect['notToBeStream'](res,exp)

})

it('Get decoded message', () =>{

    const path = './test.bmp'
    const exp = `{"message":"test."}`
    const res = JSON.stringify(Image.decode(path))
    expect['toBe'](res,exp)

})

it('Encode message on a image', () => {

    const path = './raw/test.bmp'
    const phrase = 'test'
    const exp = `{"path":"./encoded/test-encoded.bmp"}`
    const res = JSON.stringify(Image.encode(phrase, path))
    expect['toBe'](res,exp)

})


it('Upload an image', () =>{

    const buffer = fs.readFileSync("./test.bmp")
    const arrBuff = []
    arrBuff.push(buffer)
    const bufferStr = buffer.toString('utf-8')
    const res = JSON.stringify(Image.upload(arrBuff, bufferStr))
    const exp = `{"path":"./raw/test.bmp"}`
    expect['toBe'](res,exp)
    
})