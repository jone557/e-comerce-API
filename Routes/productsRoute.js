const express = require('express')
const productController = require('./../Controllers/productsController')

const router = express.Router()

router.use(express.static(__dirname+"./public/"));

router.route('/topSelling').
get(productController.aliasTopProducts,productController.getProducts)

router.route('/lipstick-products').get(productController.getLipstickProducts )

router.route('/skin-products').get(productController.getSkinProducts )

router.route('/look-products').get(productController.getLookProducts )

router.route('/eye-products').get(productController.getEyeProducts )
router.route('/brush-products').get(productController.getBrushProducts)

router.route('/lip-products').get(productController.getLipProducts )

router.route('/')
.post(productController.imageUpload, productController.addProduct)
.get(productController.getProducts)


router.route('/skins').get(productController.getSkinProducts)
router.route('/:id')
.get(productController.getProduct)
.patch(productController.updateProduct)
.delete(productController.deleteProduct)

module.exports = router