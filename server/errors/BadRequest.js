'use strict';

const { CustomAPIError, StatusCodes } = require('./custom');

class BadRequestError extends CustomAPIError {
    constructor(message) {
        super(message, StatusCodes.BAD_REQUEST);
    }
}

module.exports = { BadRequestError };