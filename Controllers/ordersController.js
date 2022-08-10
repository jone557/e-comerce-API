const Order = require('../Models/ordersModel')
const catchAsync = require('../utilities/catchAsync')
const crudController = require('./crudController')

exports.getOrders = crudController.getResults(Order)
exports.addOrder = crudController.addNew(Order)
exports.getOrder = crudController.getSingleValue(Order)
exports.updateOrder = crudController.update(Order)
exports.deleteOrder = crudController.delete(Order)