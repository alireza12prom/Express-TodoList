const errorHandlerMiddleware = require('./error-handler');
const validateParamsMiddleware = require('./params');

module.exports = { 
    errorHandlerMiddleware,
    validateParamsMiddleware
};