const express = require("express")
const wishList = require("../Controllers/wishListController");
const router = express.Router();


router.route('/').post(wishList.createWishList)
router.route('/').get(wishList.getMyWishList)
router.route('/:id').delete(wishList.deleteFromWishList);
module.exports = router;