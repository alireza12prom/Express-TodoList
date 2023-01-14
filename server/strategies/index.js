'use strict';

const passport = require('passport');
const jwtStrategy = require('./jwt');
const localStrategy = require('./local');

passport.use('local', localStrategy);
passport.use('jwt', jwtStrategy);

module.exports = { passport };