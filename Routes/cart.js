const express = require('express');
//const { addItemToCart } = require('../Controllers/cartController');
const { requireSignin, userMiddleware } = require('../middleware/auth');
const router = express.Router();
const cartController = require('./../Controllers/cartController')

router.post('/addtocart', cartController.addItemToCart)
router.post('/', cartController.getCartItems)

router.post('/removecart/', cartController.removeCartItems)
// router.route('/:id', requireSignin, userMiddleware).post(cartController.getCart)

module.exports = router;