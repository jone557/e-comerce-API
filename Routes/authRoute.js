const express = require('express')
const authController = require('./../Controllers/authController')

const router = express.Router()

router.post('/login', authController.loginUser)
router.post('/signup', authController.signup)

module.exports = router;