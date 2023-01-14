'use strict';

const { CustomAPIError, StatusCodes } = require("./custom");

class UnauthorizationError extends CustomAPIError {
    constructor(message) {
        super(message, StatusCodes.UNAUTHORIZED)
    }
}

module.exports = { UnauthorizationError }