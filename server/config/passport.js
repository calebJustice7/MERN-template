const jwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;

const Users = require('../models/User');

const opts = {};
opts.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.APP_SECRET;

module.exports = passport => {
    passport.use(
        new jwtStrategy(opts, (jwtPayload, done) => {
            Users.findOne({id: jwtPayload.id})
            .then((user) => {
                if (user) {
                    return done(null, user);
                } 
                return done(null, false);
            })
            .catch(err => console.log('Error With Passport', err));
        })
    )
}