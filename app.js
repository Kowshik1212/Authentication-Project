const http = require('http');
const server = http.createServer((req, res) => {
    const params = req.url.split('?')
    if (params[0] === '/hello') {
        res.write("Hello World");
    }
    if (params[0] === '/me') {
        const name = params[1].split('=')
        res.write(name[1])
    }
    if (params[0] === '/me/hello') {
        const name = params[1].split('=')
        res.write("Hello")
        res.write(name[1])
    }
    if (req.method === 'GET') {
        res.write("from GET")
    }
    else if (req.method === 'POST') {
        res.write("from POST")
    }
    res.end();
});

server.listen(7050);
console.log("Listening on port 7050")