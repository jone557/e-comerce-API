const jwt = require('jsonwebtoken')

const secret = 'test'
exports.requireSignin = (req, res, next) => {

    if(req.headers.authorization){
        const token = req.headers.authorization.split(" ")[1];
        const user = jwt.verify(token, secret);
        req.user = user;
    }else{
        return res.status(400).json({ message: 'Authorization required' });
        
    }
    next();
    //jwt.decode()
}

exports.userMiddleware = (req, res, next) => {
    if(req.user.role !== 'user'){
        const role = req.user.role;
        return res.status(400).json({ message: "access denied"  })
    }
    next();
}

exports.adminMiddleware = (req, res, next) => {
    if(req.user.role !== 'admin'){
        return res.status(400).json({ message: 'Admin access denied' })
    }
    
    next();
} 

// module.exports = function (req, res, next) {
//     // Get token from header 
//     const token = req.header('x-auth-token');

//     // Check if no token
//     if (!token) {
//         return res.status(401).json({
//             msg: 'No token, auth denied'
//         })
//     }

//     // Verify token 
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET)
//         // set user id in req.user
//         req.user = decoded.user;
//         next()
//     } catch (error) {
//         req.status(401).json({
//             msg: 'Token is not valid'
//         })
//     }
// } 
