const express = require("express");

//import { signin, signup } from "../Controllers/userController";
const User = require("../models/User");
const jwt = require("jsonwebtoken"); // to generate token
const bcrypt = require("bcryptjs"); // encrypt password
const { check, validationResult } = require("express-validator");
//const gravatar = require('gravatar');
const userController = require("../Controllers/userController");

const router = express.Router();

//get a singel logedin userc
//router.route('/:id').get( userController.getuser)

//get all users
// router.route("/signin").post(userController.loginUser);
router.route("/signup").post(userController.signup);
router.route("/allusers").get(userController.getusers);
//router.route('/:id').patch(userController.updateUser)
// router.use(function(req,res,next) {
//     let token;
//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith('Bearer')
//     ) {
//       token = req.headers.authorization.split(' ')[2];
//     } else if (req.cookies.jwt) {
//       token = req.cookies.jwt;
//     }
//   //  console.log(req.headers.authorization)
//     console.log('cook',req.cookies)
//       jwt.verify(token, 'test', function(err, decodedToken) {
//         if(err) { /* handle token err */
//         console.log("err",err.message)}
//         else {
//          req.userId = decodedToken.id;   // Add to req object
//          console.log("id",req.userId)
//          next();
//         }
//       });
//      });

router.patch("/updateAddress", userController.updateMe);

module.exports = router;
