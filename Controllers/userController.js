const jwt = require("jsonwebtoken"); // to generate token
const bcrypt = require("bcryptjs"); // encrypt password
const User = require("../models/User");
const crudController = require("./crudController");
const catchAsync = require("../utilities/catchAsync");
const AppError = require("../utilities/apiError");
const passport = require("passport");

const { check, validationResult } = require("express-validator");
const secret = "test";
//const auth = require('../middleware/usermiddleware');
const {
  requireSignin,
  userMiddleware,
  isAuthenticated,
} = require("../middleware/auth");
//get asingel logdin user
(exports.getuser = requireSignin),
  async (req, res, next) => {
    try {
      // get user information by id
      const user = await User.findById(req.User.id)
        .select("-password")
        .populate("myWishList");
      res.json(user);
    } catch (error) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  };

//get all users
exports.getusers = async (req, res, next) => {
  try {
    const users = await User.find().populate("myWishList");
    res.status(200).json({
      status: "success",
      results: users.length,
      data: users,
    });
    console.log(req.params);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await User.findOne({ email });

    if (!oldUser)
      return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { email: oldUser.email, id: oldUser._id, role: oldUser.role },
      secret,
      { expiresIn: "1h" }
    );
    req.id = oldUser._id;
    console.log({ oldUser });
    //req.session.isAuth = true;
    const cookieOptions = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      domain: "/",
      // signed: true
    };
    // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie("jwt", token, cookieOptions);
    //console.log(res.cookies)
    // console.log({res})

    res.status(200).json({ result: oldUser, token });

    // console.log(req.session);
    // res.redirect('/');
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const oldUser = await User.findOne({ email });

    if (oldUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email: email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign(
      { email: result.email, id: result._id, role: result.role },
      secret,
      { expiresIn: "1h" }
    );

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};

// exports.loginUser = (req, res) => {
//   passport.authenticate("local", { session: false }, (err, user, message) => {
//     if (err) return res.status(500).json({ message: err });
//     else if (user) {
//       req.login(user, async (err) => {
//         if (err) return res.status(500).json({ message: err });
//         else {
//           const token = genToken(user);
//           return res.status(200).json({ user, token });
//         }
//       });
//     } else return res.status(400).json({ message });
//   })(req, res);
// };



exports.updateUser = crudController.update(User);
exports.updateMe = async (req, res, next) => {
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  //const filteredBody = filterObj(req.body, 'contactNumber', 'address');
  try {
    console.log("i", req.user);
    //console.log("id",req.userId)
    ///console.log("idd", req.id);
    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      updatedUser,

    });
  } catch (error) {
    console.log(error.response.data);
  }
};

exports.currentUser = catchAsync(async (req, res, next) => {
  jwt.verify(req.cookies["token"], secret, function (err, decodedToken) {
    if (err) {
      /* handle token err */
    } else {
      req.userId = decodedToken.id; // Add to req object
      next();
    }
  });
});
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  console.log(token);
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, secret);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// app.use(function(req,res,next) {
//   JWT.verify(req.cookies['token'], secret, function(err, decodedToken) {
//     if(err) { /* handle token err */ }
//     else {
//      req.userId = decodedToken.id;   // Add to req object
//      next();
//     }
//   });
//  });
