'use strict';

const { CustomAPIError, StatusCodes } = require("./custom");

class ForbiddenError extends CustomAPIError {
    constructor(message) {
        super(message, StatusCodes.FORBIDDEN);
    }
}

module.exports = {
    ForbiddenError
}