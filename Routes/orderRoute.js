const express = require('express')
const orderController = require('./../Controllers/ordersController')

const router = express.Router()
router.route('/')
.post(orderController.addOrder)
.get(orderController.getOrders)

router.route('/:id')
.get(orderController.getOrder)
.patch(orderController.updateOrder)
.delete(orderController.deleteOrder)
module.exports = router