'use strict';

const { BadRequestError } = require("./BadRequest");
const { NotFoundError } = require("./NotFound");
const { UnauthorizationError } = require("./Unauthenticate");
const { ForbiddenError } = require('./Forbidden');

module.exports =  {
    BadRequestError,
    UnauthorizationError,
    NotFoundError,
    ForbiddenError
}