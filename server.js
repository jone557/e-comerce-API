const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const pkg = require("./package.json");
// const mongoStore = require("connect-mongo")(session);

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(
    DB,
    { autoIndex: false },
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
    }
  )
  .then((con) => {
    //console.log(con.connections)
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

require("./config/passport")(passport);

// cookieParser should be above session
// app.use(cookieParser());
// app.use(
//   session({
//     secret: pkg.name,
//     proxy: true,
//     resave: true,
//     saveUninitialized: true,
//   })
// );

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Authorization"
  );
  next();
});
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
