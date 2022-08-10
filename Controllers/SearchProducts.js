const Product = require('../Models/productsModel')
const catchAsync = require('../utilities/catchAsync')

exports.searchProducts = catchAsync(async (req, res, next) => {
    const filters = req.query;
    console.log(filters);
    let filteredProducts = await Product.find()
    filteredProducts = await filteredProducts.filter(searchedProduct => {
        let found = true;
        for (key in filters) {
            let searchKey = "" + filters[key];
            let string = "" + searchedProduct[key];
            found = found && (string.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1);
        }
        return found;

    });
    //  if (!filteredProducts.length) {
    //     filteredProducts = await Product.find()
    // }
    res.status(200).json({
        status: 'success',
        results: filteredProducts.length,
        data: filteredProducts
    })

})