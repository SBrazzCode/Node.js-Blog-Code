const fs = require('fs') // file system module

const path = require('path'); // https://nodejs.org/api/path.html
const mainDirectory = path.dirname(require.main.filename);  // the root directory for our project: https://stackoverflow.com/questions/10265798/determine-project-root-from-a-running-node-js-application
// dirname is really just a utility checking if it's a valid path?
const {URL} = require('url');

const hostname = "127.0.0.1"
const port = 3000

const text = (req, res) => {
    const stream = fs.createReadStream(mainDirectory + "/res/text.txt")

    stream.on('end', () => { // Do something when the stream is finished.
        res.statusCode = 200;
        res.end("Streaming Finished")
    })

    stream.pipe(res);
}

const kill = (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`) // really just parsing the URL for easy access

    if (url.searchParams.get('number') == 15) {
        process.kill(process.pid, 'SIGTERM'); // start the async shutdown.
        res.end("The mythical node.js server has been slain. Who knew 15 could be so deadly...")
    } else {
        res.end("I am ze Ubermensch!")
    }
}

const supportedMappings = new Map();  // Use map, intuitively I think the lookup performance is worth the
// memory overhead. Especially when your web app has many urls.

supportedMappings.set('/text', ["GET"]); // Use arrays, for there's only like 6 http methods
supportedMappings.set('/kill', ["GET"]);

const getMappings = new Map()
getMappings.set('/text', text) // adding the functions for each mapping
getMappings.set('/kill', kill)

const postMappings = new Map(); // where you would add post mappings for post viable urls.

// the current module and it's exports. The module object: https://nodejs.org/api/modules.html#modules_the_module_object
module.exports = { //
    hostname: hostname,
    port: port,
    supportedMappings: supportedMappings,
    getMappings: getMappings,
    postMappings: postMappings,
}