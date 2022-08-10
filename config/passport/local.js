/**
 * Module dependencies.
 */

// const mongoose = require("mongoose");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../../models/User");
const bcrypt = require("bcryptjs");

/**
 * Expose
 */

module.exports = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    User.findOne({ email }).then((user) => {
      if (!user) return done(null, false, { message: "Incorrect credential" });
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return done(err);
        else if (isMatch) return done(null, user);
        else return done(null, false, { message: "Incorrect credential" });
      });
    });
  }
);
