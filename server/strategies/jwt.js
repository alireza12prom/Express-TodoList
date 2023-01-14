'use strict';


const { ObjectId } = require('mongodb');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { Users } = require('../database');

const strategy = new Strategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
        ignoreExpiration:true
    },
    async (payload, done) => {
        console.log("*** Authenticating ***");
        const { sub } = payload;

        let user = await Users.findOne({_id: new ObjectId(sub)});
        if (!user) {
            return done(null, false)
        }
        done(null, { userId: user._id, email: user.email, name: user.name});
    }
);

module.exports = strategy;