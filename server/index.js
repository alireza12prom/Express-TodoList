'use strict';

require("dotenv").config();
require('express-async-errors');
require('./strategies');
const passport = require('passport');
const logger = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const { connect } = require('./database');
const routes = require('./routers');
const { errorHandlerMiddleware } = require('./middleware');
const { join, dirname } = require('path');

class Server {
    constructor() {
        this.server = express();
    }

    setup(config) {
        this.server.set('env', config.development.env);
        this.server.set('port', config.development.port);
        this.server.set('host', config.development.host);
        
        
        this.server.use(logger('dev', {
            skip: function(request, response) {
                return request.baseUrl.includes('client')
            }
        }));
        this.server.use(bodyParser.json());
        this.server.use('/client', express.static(join(dirname(__dirname), "client")));

        this.server.use(passport.initialize());
        
        this.server.use('/', routes);
        this.server.use(errorHandlerMiddleware.notFoudRouts);
        this.server.use(errorHandlerMiddleware.generalErrors);
    }

    start() {
        let port = this.server.get('port');
        let host = this.server.get('host');
        connect.connect();
        this.server.listen(port, host, async () => {
            try{
                await connect.connect();
                console.log("<< Mongodb Connected >>");
                console.log(`Server On: http://${host}:${port}`);
            } catch(error) {
                console.log(error.message);
            }
        });
    }
}


module.exports = new Server();