var express = require('express')
var router = express.Router();

// importing the User model for authentication
var User = require('../models/user');


// importing  npm module -- npm i  speakeasy
var speakeasy = require("speakeasy");



function isUserLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

router.get('/', isUserLoggedIn, (req,res,next)=>{
  
        var encodedKey = speakeasy.generateSecret({
          name: req.user.username
      })
      console.log(encodedKey);

      var otpURL = encodedKey.otpauth_url;

      console.log(otpURL);
     

      var qrImageString = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(otpURL);

      console.log(encodeURIComponent(otpURL));

      let messages = req.session.messages || [];
      req.session.messages = [];

      res.render('2FA/index',{
        user: req.user,
        qrImage: qrImageString,
        key: encodedKey,
        messages: messages
      });

});






module.exports = router;