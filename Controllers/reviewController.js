const crudController = require("./crudController");
const Reviews = require("../Models/Reviews")

exports.createReviews = crudController.addNew(Reviews)
exports.getAllReviews = crudController.getResults(Reviews)
exports.getProductReviews = crudController.getSingleValue(Reviews)