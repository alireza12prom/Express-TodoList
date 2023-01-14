'use strict';

const { Strategy } = require('passport-local');
const { Users } = require('../database');
const bcrypt = require('bcryptjs');

const options = {
    usernameField: 'email',
    passwordField: 'password'
};

const strategy = new Strategy(options, async (email, password, done) => {
    let user = await Users.findOne({ email:email });
    if (!user) return done(null, false);

    let isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return done(null, false);

    done(null, user)
});


module.exports = strategy;