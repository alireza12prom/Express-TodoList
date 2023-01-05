require("dotenv").config({debug:true});
const bodyParser = require("body-parser");
const path = require("path");
const logger = require("morgan");
const { errorHandler } = require("./middleware/error-handler");
const { client } = require('./database/connect');
const { createCustomError } = require("./errors/custom-error");

const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '127.0.0.1';

// logger
app.use(logger('dev', {
    skip: function(request, response) {
        return request.baseUrl.includes('public')
    }
}));

// middlewares
app.use(bodyParser.json());
app.use('/public',express.static(path.join(__dirname, "public")));

// routers
app.use("/api/v1/tasks",require("./routers/tasks"))
app.use("/api/v1/lists",require("./routers/lists"))

// root
app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, '/public/home.html'));
})

// handle not found pages
app.all('*', (request, response, next) => {
    return next(createCustomError('Not found', 404));    
})

// handle error
app.use(errorHandler);

const start = async () => {
    try{
        await client.connect();
        console.log("<< Mongodb connect >>");
        
        app.listen(PORT, () => {console.log(`Server run: http://${HOST}:${PORT}`);});
    } catch(error) {
        client.emit('error', error);
    }
}
start();