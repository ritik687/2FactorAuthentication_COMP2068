var express = require('express');
var router = express.Router();

// importing for authentication
var User = require('../models/user');
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Two-Factor Authentication' 
  });
});
/* Routes for the login */

// get handler
router.get('/login', (req, res, next) => {
  let messages = req.session.messages || [];
  req.session.messages = [];
  res.render('login', {
    title: 'Login',
    messages: messages,
    user: req.user
  });
});

// post handler
router.post('/login', passport.authenticate('local', {
  successRedirect: '/loginSuccess',
  failureRedirect: '/login',
  failureMessage: 'Invalid Credentials'
}));

/* Routes for the register */
// GET
router.get('/register', (req, res, next) => {
  res.render('register', {
    title: 'Register',
    user: req.user
  });
});

// POST
router.post('/register', (req, res, next) => {
  User.register(
    new User({
      username: req.body.username
    }),
    req.body.password,
    (err, newUser) => {
      if (err) {
        console.log(err);
        return res.redirect('/register');
      } else {
        req.login(newUser, (err) => {
          res.redirect('/loginSuccess');
        });
      }
    }
  );
});


module.exports  =  router;



