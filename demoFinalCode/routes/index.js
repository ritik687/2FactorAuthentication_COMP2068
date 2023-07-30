var express = require('express');
var router = express.Router();

// importing for authentication
var User = require('../models/user');
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Two-Factor Authentication',
    user: req.user
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
    // user: req.user
  });
});

// post handler
router.post('/login', passport.authenticate('local', {
  successRedirect: '/loggedIn',
  failureRedirect: '/login',
  failureMessage: 'Invalid Credentials'
}));

/* Routes for the register */
// GET
router.get('/register', (req, res, next) => {
  res.render('register', {
    title: 'Register',
    //user: req.user
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
      } 
      else {
        // req.login(newUser, (err) => {
        //   res.redirect('/loggedIn');
        // });
        res.redirect('/registered');
      }
    }
  );
});



// get handler for the registered user.
router.get('/registered', (req,res,next)=>{
  res.render('registered',{
    title: "Successfully Registered"
  });

});


// get handler for the logout user
router.get('/logout', (req, res, next) => {
  

  // log user out
  req.logout(function(err){
    if(err)
    {
      console.log(err);
      return next(err);
    }
  });
  // send user back to login page
  res.redirect('/login');
});


//get handler to check if the current user is logged in or not and also check if the current use has initialized 2FA and if they are verified
router.get('/loggedIn', 
(req, res, next)=>{
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}, 
(req, res, next)=>{
  res.render('loggedIn', {
    title: 'Login Successful',
    user: req.user
  });
}

)


module.exports  =  router;



