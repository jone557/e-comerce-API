const mongoose = require("mongoose");

const wishListSchema = mongoose.Schema({

    addedAt: {
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

wishListSchema.index({product: 1, user: 1}, {unique: true});

wishListSchema.pre(/^find/, function(next) {

    this.populate({
        path: "product",
        select: "title _id images description price title rating ratingQuantity"
    }).populate({
        path: "user",
        select: "_id"
    })
    
    next();

})

const wishList = mongoose.model('wishList', wishListSchema);

module.exports = wishList;