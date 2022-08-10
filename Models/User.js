const mongoose = require('mongoose');
const crypto = require("crypto");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    // required: true,
  },

  contactNumber: {
   type: Number
  },
  role: {
    //  (normal or admin )
    type: String,
    enum: ['user','admin'],
    default: 'user',
  },
  history: {
    // order history
    type: Array,
    default: [],
  },
  address:{
    type:String
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  passwordChangedAt: Date
},{timestamps: true});

UserSchema.methods.createPasswordResetToken = function () {

     const resetToken = crypto.randomBytes(32).toString('hex');

     this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
     this.resetPasswordExpires = Date.now() + 100 * 60 * 1000;
     return resetToken;

}

UserSchema.methods.chagedPasswordAfter = function(JWTTIMESTAMP) {

  if (!this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000, 10);

    return JWTTIMESTAMP < changedTimeStamp;
  }

  return false;

}
UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
})

UserSchema.virtual("reviews", {
   ref: 'Reviews',
   foreignField: 'user',
   localField: '_id'
})

UserSchema.virtual("myWishList", {
  ref: "wishList",
  foreignField: 'user',
  localField: '_id'
})

try {
  User = mongoose.model('User')
} catch (error) {
  User = mongoose.model('User', UserSchema)
}
module.exports = User;

