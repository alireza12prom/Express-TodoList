'use strict';

const { Router } = require('express');
const router = Router();

const passport = require('passport');
// routes
const homeRouter = require('./home');
const authRouter = require('./auth');
const ApiRouter = require('./api');
const registerRout = require('./register');

router.use('/', homeRouter);
router.use('/auth', authRouter);
router.use('/register', registerRout);

router.use('/api', passport.authenticate('jwt', { session: false }), ApiRouter)

module.exports = router;