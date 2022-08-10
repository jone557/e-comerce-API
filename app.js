const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

// const cors = require('cors')
const session = require("express-session");
const productRouter = require("./Routes/productsRoute");
const userRouter = require("./Routes/userRoute");
const Password = require("./Routes/passwordRoute");
const AppError = require("./utilities/apiError");
const adminRouter = require("./Routes/admin/auth");
const cartRouter = require("./Routes/cart");
const cors = require("cors");
const authRoute = require('./Routes/authRoute')
const orderRouter = require("./Routes/orderRoute");
const globalErrHandler = require("./Controllers/errorContoller");
const looksRouter = require("./Routes/looksRoute");
const searchRoute = require("./Routes/searchRoute");
const reviews = require("./Routes/reviewRoute");
const wishList = require("./Routes/wishListRoute");
const cookieParser = require("cookie-parser");
const { cookie } = require("express-validator");
const passport = require("passport");
//creating application
const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
//app.use(cors())

app.use(cookieParser());
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    //  store: store
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 30,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// app.use((req,res,next) =>{
//   console.log('cooki',req.cookies)
//   next();
// })
app.use(express.static("public/"));
app.use(bodyParser.json());

// app.use(cors())
app.get("/", (req, res) => {
  res.send("Welcome");
});
app.use(morgan("dev"));

// authorization
const authorizationMiddleware = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, message) => {
    if (err || !user.id) {
      if (Object.keys(message).length) return res.status(401).json({ message });
      else
        return res
          .status(401)
          .json({ message: "No user found with this token" });
    } else {
      req.user = user.id;
      return next();
    }
  })(req, res, next);
};

//routes

app.use("/api/v1/products/", productRouter);
// app.use('/api/v1/user/',userRouter)
app.use("/api/v1/user/password", Password);
app.use("/api/v1/search-products/", searchRoute);
app.use("/api/v1/reviews", reviews);
app.use("/api/v1/wishList", authorizationMiddleware, wishList);
app.use("/api/v1/admin", adminRouter);
// app.use("/api/v1/cart",  cartRouter);
app.use("/user", authorizationMiddleware, userRouter);
app.use("/admin", adminRouter);
app.use("/user/cart", authorizationMiddleware, cartRouter);
app.use("/api/v1/orders/", orderRouter);
app.use("/api/v1/looks/", looksRouter);
app.use("/api/auth", authRoute)
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrHandler);
module.exports = app;
