const http = require('http');
const chalk = require('chalk');
const { URL } = require('url');     //There is a URL native to javascript and it does everything this URL does. After a little research
// I couldn't find a quick answer that justifies this URL's existence. The native
// URL seems sufficient, but this is a Node tutorial so lets use the Node one.


const config = require('./MappingConfigurations');
const { supportedMappings } = require('./MappingConfigurations');


//Create server and pass listenerFunction
const server = http.createServer((req, res) => {

    //do url mapping first into method router check
    try {

        if (isValidRoute(req))
            methodRouter(req, res);

    } catch (e) {
        if (e instanceof RoutingError) {
            res.setHeader('Content-Type', 'text/plain');
            res.statusCode = e.statusCode;
            res.end(e.message)
        } else{
            throw(e)
        }
    }

    //tell browser reponse is finished and send body
    // res.end('Hello World');

    //start the shutdown process by sending the terminate signal

});

const isValidRoute = (req) => {

    const url = new URL(req.url, `http://${req.headers.host}`);

    const pathname = url.pathname.toLowerCase();
    const method = req.method;

    if (!config.supportedMappings.has(pathname)) { // check if url is valid
        throw new RoutingError(pathname + " 404", 404)
    }

    if (config.supportedMappings.get(pathname).includes(method)) { // check if the url supports the HTTP method from the req.
        return true;
    } else {
        throw new RoutingError(method + " method not supported for " + pathname, 405)
    }
}

const methodRouter = (req, res) => {

    let method = req.method;
    const url = new URL(req.url, `http://${req.headers.host}`);

    const pathname = url.pathname.toLowerCase();

    switch (method) {
        case "GET": config.getMappings.get(pathname)(req, res) // This a race condition if someone hotswaps MappingConfigurations.
            break;
        case "POST": console.log("feature not here yet");
            break;
        default: throw new RoutingError('We don\'t know what happened', 500);
    }
}

class RoutingError extends Error {

    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode
    }
}

//tell server to listen at the hostname:port socket. 
server.listen(config.port, config.hostname, () => {

    //use chalk to print a green message
    console.log(chalk.green(`Server running at http://${config.hostname}:${config.port}/`));
});

//handle the terminate signal
process.on('SIGTERM', () => {

    //close the last open resources
    server.close(() => {
        console.log(chalk.red('Process terminated'));
    })
});
