const mongoose = require('mongoose')
const slugify = require('slugify')
const productSchema = new mongoose.Schema({
    title:{
       type:String,
       required:[true,'A product must have title']

    },
    rating: {
      type:Number,
      set: val => Math.round(val * 10) / 10,
      default:1.0
    },
    ratingQuantity:{
       type: Number,
       default: 0
    },

    price:{
       type: Number,
       required:[true,'A product must have price']
    },
    ingredients:[String],
    brand:String,
    madeIn:String,
    category:{
        type:String,
        required:true,
        enum:[]
    },
    description:String,
    images:{
       type:[String],
      required:[true,'A product must have an image']},
   tag:[String],
   shipping_amnt:Number,
   amnt_inStock:Number,
   discount:Number,
   size:String,
   created_At:{
       type:Date,
       default:Date.now
    },
    color:String,
    direction:[String],
    details:[String],
    slug:String

},{
   toJSON:{ virtuals: true},
   toObject:{virtuals:true}
})
productSchema.pre(/^save/,function(next){
   this.slug = slugify(this.title,{lower:true})
   next();
})


productSchema.virtual("reviews", {
   ref: 'Reviews',
   foreignField: 'product',
   localField: '_id'
})
const Product = mongoose.model('Product',productSchema)

module.exports = Product;
