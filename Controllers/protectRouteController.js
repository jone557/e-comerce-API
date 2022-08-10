const AppError = require("../utilities/apiError");
const catchAsync = require("../utilities/catchAsync");
const { promisify } = require('util');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');

dotenv.config({path:'../config.env'});

const User = require("../Models/User");

exports.protectRoute = catchAsync(async (req, res, next) => {
    
    // 1. Getting token and check if is there. 

    let token; 
    console.log(req.header);
    if (req.header.authorization && req.header.authorization.startsWith("logged")){
        token = req.header.authorization.split(' ')[1]
    }

    if(!token) {
        return next(new AppError("You are not logged in. Login to get access!", 401));
    }
   
    // 2. Verification token
    let decoded;
    try{
        decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    } catch(error) {
        if (error.name === 'JsonWebTokenError') {
            return next(new AppError("Invalid token, please login again!", 401));
        }
        if (error.name === 'TokenExpiredError') {
            return next(new AppError("Your token has expired, please login again!", 401))
        }
    }

    // 3. Check if the user exists 

    const currentUser = User.findById(decoded.id);
    
    if (!currentUser) {
        return next(new AppError("User no longer exists", 401));
    }

    // 4. Check if user changed password after the token was issued 

    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError("User recently changed password, please login again!", 401));
    }
    req.user = currentUser;
    next();
})