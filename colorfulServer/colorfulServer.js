const http = require('http');
const chalk = require('chalk');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer( (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');

    process.kill(process.pid, 'SIGTERM');

});

server.listen(port, hostname, () => {
    console.log(chalk.green(`Server running at http://${hostname}:${port}/`));
});

process.on('SIGTERM', () => {
    server.close(() => {
        console.log(chalk.red('Process terminated'));
    })
});