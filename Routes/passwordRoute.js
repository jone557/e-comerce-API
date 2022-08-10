const express = require('express')
const password = require('./../Controllers/PasswordController')
const protectRoute = require("../Controllers/protectRouteController");


const router = express.Router()

router.route('/forget-password').post(password.forgetPassword);
router.route('/reset-password/:token').patch(password.resetPassword);
// router.route('/update-password').post(protectRoute.protectRoute, password.updatePassword)
module.exports = router

