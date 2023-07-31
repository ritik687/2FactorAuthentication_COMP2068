var express = require('express');
var router = express.Router();

// importing for authentication
var User = require('../models/user');
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { 
    Title: 'Home Page',
    title: '2-Factor Authentication',
    user: req.user
  });
});



/* Routes for the login */

// get handler
router.get('/login', (req, res, next) => {
  let messages = req.session.messages || [];
  req.session.messages = [];
  res.render('login', {
    Title: 'Login',
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
    Title: 'Register',
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
    Title: 'Registered',
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





//get handler to check if the current user is logged in or not and also check if the current use has initialized 2FA and if they are verified.. Making separate isUserLoggedIn function to check if the user is logged in or not.

function isUserLoggedIn(req, res, next)
{
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

function isUserTwoFactorAuthenticated(req, res, next)
{
if(req.user.secretKey != null)
{

  if(req.session.twoFAuthenticated){
    
    return next();
    
  }
  else{
    res.redirect('2FA/verify')
  }
}

else{
  return next();
}
}

router.get('/loggedIn', isUserLoggedIn, isUserTwoFactorAuthenticated,
(req, res, next)=>{

 var title = '';
 var flag;
 if(req.session.twoFAuthenticated){
 
  title = "Login successful with Two-Factor authentication";

 }
 else{
  flag = true;
  title= "Login Successful but 2-Factor Authentication is not added yet.";
 }

  res.render('loggedIn', {
    Title: 'Logged-In',
    title: title,
    user: req.user,
    flag: flag
  });
}

)


module.exports  =  router;



