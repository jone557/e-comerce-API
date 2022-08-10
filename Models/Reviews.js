const mongoose = require("mongoose");
const Product = require('../Models/productsModel');

const reviewSchema = mongoose.Schema({

    review: {
        type : String,
        required: [true, "Review cannot be empty"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,

    },

    createdAt: {
        type: Date,
        default: Date.now()
    },

    product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: [true, "Review must belong to product!"]
    },
    user :  {
        type : mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "User must be specified!"]
    }
},{
   toJSON:{ virtuals: true},
   toObject:{virtuals:true}
})

// Is used to allow only one review per user.
reviewSchema.index({product: 1, user: 1}, {unique: true});

reviewSchema.pre(/^find/, function(next) {

    // this.populate({
    //     path: "product",
    //     select: "title _id"
    // }).populate({
    //     path: "user",
    //     select: "name _id"
    // })
    this.populate({
        path: "user",
        select: "name _id"
    })
    next();

})

// Calculating average rating 

reviewSchema.statics.averageRating = async function(productId) {

    const stats = await this.aggregate([
        {
            $match: {product: productId}
        },
        {
            $group: {
                _id: '$product',
                numberofRating: {$sum: 1},
                avgRating: {$avg: '$rating'}
            }
        }
       
    ])
    if (stats.length > 0) {  
     await Product.findByIdAndUpdate(productId, {
            ratingQuantity: stats[0].numberofRating,
            rating: stats[0].avgRating
     });   
    } else {
         await Product.findByIdAndUpdate(productId, {
            ratingQuantity: 0,
            rating: 1.0
     });   
    }
}

reviewSchema.post("save", function() {
    this.constructor.averageRating(this.product);
})

const Reviews = mongoose.model('Reviews', reviewSchema);

module.exports = Reviews;