'use strict';

const { StatusCodes } = require('http-status-codes');
const { MongoServerError } = require('mongodb');

class ErrorHandlerMiddleware {
    constructor() {}

    notFoudRouts(request, response) {
        response.status(StatusCodes.NOT_FOUND).json({ msg: `rout is not found!`});
    }

    generalErrors(error, request, response, next) {
        const ErrorObject = {
            statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message || 'server error occurred'
        };
    
        if (error.code  === 11000 && error.message.includes('duplicate key error collection')) {
            ErrorObject.statusCode = StatusCodes.BAD_REQUEST;
            ErrorObject.message = `User with email ${error.keyValue.email} is already registred`
        } else if (error instanceof MongoServerError) {
            ErrorObject.message = 'database error occurred'
        }
        
        response.status(ErrorObject.statusCode).json({ msg: ErrorObject.message });
        console.log(`/!\\ ${error}`);
    }
}

module.exports = new ErrorHandlerMiddleware();