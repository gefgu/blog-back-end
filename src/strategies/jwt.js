const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

module.exports = new JwtStrategy(opts, (jwtPayload, done) => {
  User.findById(jwtPayload.userId).exec((err, user) => {
    if (user) return done(null, user);
    return done(err);
  });
});
