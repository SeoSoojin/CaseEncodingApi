const http = require('http');
const Image = require('./controllers/image.js');

const PORT = process.env.PORT || 3030;


//Start the HTTP server
const server = http.createServer((req, res) => {

    var func = ''
    //Handler of endpoint routes
    const routes = {

        '/upload': (req, res) => {Image.upload(req, res)},
        '/write-message-on-image': (req, res) => {Image.WriteMessageOnimage(req, res)},
        '/get-image': (req,res) => {Image.getImage(req, res)},
        '/decode-message-from-image': (req, res) => {Image.decodeMessageFromImage(req, res)},
        'default' : (req, res) => {
            res.writeHeader(404, 'End point not founded!')
            res.end()
        }

    }
    if(req.method === 'GET'){

        const startOfName = req.url.lastIndexOf('/')
        func = req.url.slice(req.url.lastIndexOf('/', startOfName-1), startOfName)
        

    }else if(req.method === 'POST'){

        func = req.url

    }
    if(typeof routes[func] === 'function'){

        routes[func](req, res)

    }else{

        routes['default'](req, res)
    }
    
})

//Start listen the port
server.listen(PORT, () => {

    console.log(`Server is running in PORT ${PORT}`);

});

module.exports = {

    server: server
    
}