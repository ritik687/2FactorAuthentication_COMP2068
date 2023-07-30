var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// importing mongoose and the configuration
var config = require('./config/globals')
var mongoose = require('mongoose');

var passport = require('passport');
var session = require('express-session');

var indexRouter = require('./routes/index');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Congigure passport session cookie
app.use(session({
  secret: '2FASampleSummer2023',
  resave: false,
  saveUninitialized: false
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

const User = require('./models/user');
passport.use(User.createStrategy());


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use('/', indexRouter);




// connect to the mongodb 
mongoose
  .connect(config.db, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  }) // connect
  .then((message)=>{
    console.log("Connection Successful");
  }) // do something after connecting
  .catch((err)=>{
    console.log('Error while connecting: '+ err);
  }); // catch any errors



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
