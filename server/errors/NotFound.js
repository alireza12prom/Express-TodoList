'use strict';


const { CustomAPIError, StatusCodes } = require("./custom");

class NotFoundError extends CustomAPIError {
    constructor(message) {
        super(message, StatusCodes.NOT_FOUND);
    }
}
module.exports = { NotFoundError };