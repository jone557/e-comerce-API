const express = require("express")
const reviews = require("../Controllers/reviewController");
const protectRoute = require("../Controllers/protectRouteController");
//const {userMiddleware}= require('../middleware/usermiddleware');
const router = express.Router();


router.route('/').post(reviews.createReviews)
router.route('/').get(reviews.getAllReviews);



module.exports = router;
