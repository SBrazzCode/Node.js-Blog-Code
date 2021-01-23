//import the http module
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

//Create server and pass listenerFunction
const server = http.createServer( (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    
    //tell browser reponse is finished and send body
    res.end('Hello World');

    //start the shutdown process by sending the terminate signal
    process.kill(process.pid, 'SIGTERM');

});

//tell server to listen at the hostname:port socket. 
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

//handle the terminate signal
process.on('SIGTERM', () => {
    
    //close the last open resources
    server.close(() => {
        console.log('Process terminated');
    })
});
