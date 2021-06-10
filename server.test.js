const Server = require('./server.js')
const http = require('http')
const {it, expect} = require('./utils/Tdd.js')
const fs = require('fs')

const decode = () => {

    http.get('http://localhost:3030/decode-message-from-image/test-encoded.bmp', (res) => {

        const exp = '{"message":"test."}'
        var resp = ''
        res.on('data', (chunk) => {

            resp += chunk.toString()

        })
        res.on('end', ( ) =>{

            console.log(`---> Get an decoded message\n`)
            expect['toBe'](resp, exp)

        })
    })

}

const get = () => {

     http.get('http://localhost:3030/get-image/test-encoded.bmp', (res) => {

        const bufferExp = fs.readFileSync('./encoded/test-encoded.bmp')
        const exp = 0
        const arr = []
        res.on('data', (chunk) => {

            arr.push(chunk)

        })
        res.on('end', () =>{
    
            console.log(`---> Get an decoded message\n`)
            const bufferRes = Buffer.concat(arr)
            const resp = Buffer.compare(bufferExp, bufferRes)
            expect['toBe'](resp, exp)
        })
     })
}

const write = () => {

    const data = JSON.stringify({
        
        "path": "./raw/test.bmp",
        "phrase": "test"
        
    });

    const config = {

        hostname: 'localhost',
        port: 3030,
        path: '/write-message-on-image',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
    }
    const req = http.request(config, (res) => {

        const exp = '{"path":"./encoded/test-encoded.bmp"}'
        var resp = ''
        res.on('data', (chunk) => {

            resp += chunk.toString()

        })

        res.on('end', () => {

            console.log(`---> Write message on image\n`)
            expect['toBe'](exp, resp)
            Server.server.close()

        })
    })
    req.write(data)
    req.end()

}

Server.server.on('listening', () => {

    decode()
    get()
    write()

})
