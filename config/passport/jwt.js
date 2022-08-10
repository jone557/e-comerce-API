const User = require("../../Models/User");
const JWTStratagy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "7B2394B6D7264121F114CCA138A8A",
};

module.exports = new JWTStratagy(options, (payload, done) => {
  const { _id } = payload;
  User.findById(_id)
    .then((user) => {
      if (!user)
        return done(null, false, { message: "No user found with this token" });
      else return done(null, { id: _id });
    })
    .catch((err) => done(null, false, { message: err }));
});
