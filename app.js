const fs = require('fs');
const server = require('./server')
const config = JSON.parse(fs.readFileSync('./config/server.json'));

server.setup(config);
server.start();