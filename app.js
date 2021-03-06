var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
const passport = require("passport");
const config = require("./config");
// var cookieParser = require("cookie-parser"); //Remember: no usar con express-session
// const session = require("express-session");  
// const FileStore = require("session-file-store")(session);
// const authenticate= require('./authenticate');

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var campsiteRouter = require("./routes/campsiteRouter");
var partnerRouter = require("./routes/partnerRouter");
var promotionRouter = require("./routes/promotionRouter");
var uploadRouter = require('./routes/uploadRouter');
var favoriteRouter= require('./routes/favoriteRouter');

const mongoose = require("mongoose");
const url = config.mongoUrl;
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connect
  .then(() => console.log("Connected corretly to the server"))
  .catch((err) => console.log(err));

var app = express();

// Secure traffic only 
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
      console.log(`Redirecting to: https://${req.hostname}:${app.get('secPort')}${req.url}`);
      res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`);
  }
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// Middlewares (! importante el orden q le damos)
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
// app.use(passport.session());
app.use("/", indexRouter);
app.use("/users", usersRouter);
// //Basic-Authentication

app.use(express.static(path.join(__dirname, "public")));

app.use("/campsites", campsiteRouter);
app.use('/favorite', favoriteRouter);
app.use("/partners", partnerRouter);
app.use("/promotions", promotionRouter);
app.use('/imageUpload', uploadRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;