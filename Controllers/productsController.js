const Product = require('../Models/productsModel')
const catchAsync = require('../utilities/catchAsync')
const crudController = require('./crudController')
const AppError = require("../utilities/apiError");
const multer = require('multer');
const sharp = require('sharp');
// Adding Image to database logic
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/uploads');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `product-${req.user}-${Date.now()}.${ext}`);
    }
});
const multerfilter = (req, file, cb) => {
    console.log(file);
    if (file.mimetype.startsWith("image")) {
        cb(null, true)
    }
    else cb(new AppError("You can only upload images", 400), false);
};

const upload = multer({
    storage: storage,
    fileFilter: multerfilter
})

exports.imageUpload = upload.array('images', 2);

// Image resizing 

// exports.resizeImage = async (req, res, next) => {

//     if(!req.files) return next();
//     console.log(req.files);

//     await sharp(req.files).resize(500, 500).jpeg({quality: 90});

//     next();
// }
exports.getProducts = crudController.getResults(Product)
exports.addProduct = crudController.addNew(Product)
exports.getProduct = crudController.getSingleValue(Product)
exports.updateProduct = crudController.update(Product)
exports.deleteProduct = crudController.delete(Product)
exports.aliasTopProducts = (req, res, next) => {
    req.query.limit = '5'
    req.query.fields = 'title,price,images,ratingsAverage'
    //console.log(req.query)
    next()


}
exports.getLipstickProducts = crudController.getCategory(Product, 'lipstick')
exports.getSkinProducts = crudController.getCategory(Product, 'skin')
exports.getLookProducts = crudController.getCategory(Product, 'looks')
exports.getEyeProducts = crudController.getCategory(Product, 'eyes')
exports.getLipProducts = crudController.getCategory(Product, 'lips')

exports.getBrushProducts = crudController.getCategory(Product, 'brushes');
exports.getStatus = catchAsync(async (req, res) => {

    const status = await Product.aggregate([
        {
            $match: { rating: { $gte: 3 } }
        },
        {
            $group: {
                _id: null,
                avgRating: { $avg: '$rating' },
                numProducts: { $sum: 1 }
            }
        }, {
            $sort: { avgRating: 1 }
        }, {
            $match: { _id: { $ne: 'lipstick' } }
        }
    ])
    console.log(lipSticks)
    res.status(200).json({
        status: 'success',
        results: status.length,
        data: status
    })

})
