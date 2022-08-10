const crudController = require("./crudController");
const wishList = require("../Models/wishList");
const catchAsync = require('../utilities/catchAsync')
const ApiFeatures = require('../utilities/apiFeatures')

exports.createWishList = crudController.addNew(wishList)
exports.getMyWishList = catchAsync(async (req, res, next) => {
    const features = new ApiFeatures(wishList.find(), req.query)
        .filter()
        .sort()
        .limit()
        .pagination()

    const results = await features.query
    let filteredProducts = await results.filter(searchedUser => {
        let found = true;
        if (searchedUser.user._id != req.user) {
            found = false;
        }
        return found;

    });
    const addedProduct = [];
    for (let i = 0; i < filteredProducts.length; i++) {
        addedProduct.push(filteredProducts[i].product);
    }

    res.status(200).json({
        status: 'success',
        results: filteredProducts.length,
        data: addedProduct
    });

})

exports.deleteFromWishList = catchAsync(async (req, res, next) => {
    const results = await wishList.find();
    console.log("Results", results);
    console.log("Length", results.length);
    console.log("IDDD", req.params.id);
    let filteredProducts = await results.filter(searchedProduct => {
        console.log("Searched Product Id ", searchedProduct.product.id);
        if (searchedProduct.product.id === req.params.id && searchedProduct.user._id == req.user) {
            return true;
        }

    });
    const id = filteredProducts[0]._id
    await wishList.findByIdAndDelete(id);
    res.status(204).json({
        status: 'success',
        message: "Removed from wish list",
        data: req.params.id
    })
})