const { Router } = require('express');
const router = Router();

const passport = require('passport');
const { TokenService } = require("../services");
const { StatusCodes } = require('http-status-codes');

router.post('/', passport.authenticate('local', { session:false }), (request, response) => {
    const { remember } = request.body;
    let payload = {
        sub:request.user._id,
        name:request.user.name
    }

    let token = TokenService.createToken(payload, remember ? process.env.TOKEN_LIFETIME : null);
    response.status(StatusCodes.OK).json({ token: token });
})


module.exports = router;