const Look = require('../Models/looksModel')
const catchAsync = require('../utilities/catchAsync')
const crudController = require('./crudController')

exports.getLooks = crudController.getResults(Look)
exports.addLook = crudController.addNew(Look)
exports.getLook = crudController.getSingleValue(Look)
exports.updateLook = crudController.update(Look)
exports.deleteLook = crudController.delete(Look)


