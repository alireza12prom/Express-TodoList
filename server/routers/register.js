'use strict';

const { Router } = require('express');
const router = Router();

const { StatusCodes } = require('http-status-codes');
const { TokenService } = require("../services");
const { registerController } = require('../controller');

router.post('/', registerController, (request, response) => {
    let payload = {
        sub:request.user._id,
        name:request.user.name
    }

    let token = TokenService.createToken(payload);
    response.status(StatusCodes.OK).json({ token: token });
})


module.exports = router;