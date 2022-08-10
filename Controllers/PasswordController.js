const crypto = require('crypto');
const User = require("../Models/User");
const AppError = require('../utilities/apiError');
const catchAsync = require("../utilities/catchAsync");
const sendEmail = require("./email");
const dotenv = require('dotenv');
dotenv.config({path:'../config.env'});

const jwt = require('jsonwebtoken');

const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: Date.now() + 10 * 60 * 1000
    })
}
exports.forgetPassword = catchAsync(async (req, res, next) => {
    
    // Get find user by the provided email
    // try{
        const { email } = req.body;
    
        const user = await User.findOne( {email} );
        if (!user) {
            res.status(404).json({
                status:'not found',
                message:err.message
            })
        }    
        
          /*
          ** Generate token
          */ 

        const resetToken = user.createPasswordResetToken();
        console.log(resetToken);
        await user.save(); // Saves the newly created token

         /*
        ** Send it to the user
        */ 
       
        const reset_url = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;
        const message = `Seems that you forgot your password, right?\n\n Submit your new password to : <a href="www.javatpoint.com">${resetToken}</a>.\n\n\n If you didn't forget, please ignore this message.`;
       

        try {
            
            await sendEmail({
            email: email,
            subject: 'Reset password token (valid for 10 mins)',
            message
            }).then(result => console.log("Email sent....", result)).catch( err => console.log(error));

            res.status(200).json({
                status: "success",
                message: 'Token sent to email.'
            })

        }
        catch {
            user.resetPasswordToken = undefined;
            user.resetPasswordexpires = undefined;
            await user.save();
            res.status(201).json({
                status: "Failed!",
                message: "unable to send email"
            })
        }
})

exports.resetPassword = catchAsync(async (req, res, next) => {

    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest('hex');

    const user = await User.findOne({resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: Date.now()}});

    if (!user) {
        return next(new AppError("Token is invalid or has expired", 400));
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const token = signToken(user._id);
    res.status(200).json({
        status: "success",
        token
    })
})

exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1. Get the user for your collection
    const { passwordCurrent, newPassword } = req.body;
    const user = await user.find(req.user.id).select('+password');
    // 2. Verify the users current password

    // if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    //     return next(new AppError("Wrong current password", 401));
    // }
    
    // 3. Update the password

    user.password = newPassword;

    user.confirmPassword = newPassword;
    await user.save();
    // 4. Log user in, send JWT token 

    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token
    })


})