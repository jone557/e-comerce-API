const express = require('express')
const searchProducts = require('./../Controllers/SearchProducts');

const router = express.Router()

router.route('/').get(searchProducts.searchProducts);

module.exports = router