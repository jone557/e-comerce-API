const mongoose = require('mongoose')
const slugify = require('slugify')
const looksSchema = new mongoose.Schema({
    products:{
        type:[mongoose.Schema.ObjectId],
        ref:"Product",
        required:[true,'Products used must be added']
    },
    
    name:{
        type:String,
        required:true
    },
    total_price:{
        type:Number
    },
    slug:String,
    images:[String]
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

//documents functions
looksSchema.pre(/^save/,function(next){
    this.slug = slugify(this.name,{lower:true})
    next();
})
looksSchema.pre(/^find/,function(next){
    this.populate({
        path:'products',
        select:'price title'
    })
    next()
})
const Look = mongoose.model('Look',looksSchema)
module.exports = Look
