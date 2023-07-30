var express = require('express')
var router = express.Router();

// importing the User model for authentication
const User = require('../models/user');


// importing  npm module -- npm i  speakeasy
var speakeasy = require("speakeasy");
const { token } = require('morgan');



function isUserLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

router.get('/', isUserLoggedIn, (req,res,next)=>{
  
        var secretKeyObject = speakeasy.generateSecret({
          name: req.user.username
      })
      
      var otpURL = secretKeyObject.otpauth_url;
      
      console.log(secretKeyObject);
      console.log(otpURL);
     

      var qrImageString = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(otpURL);

      console.log(encodeURIComponent(otpURL));

      let messages = req.session.messages || [];
      req.session.messages = [];

      res.render('2FA/index',{
        Title: 'Google-Authentication',
        user: req.user,
        qrImage: qrImageString,
        secretKey: secretKeyObject.base32,
        messages: messages
      });

});


router.post('/', isUserLoggedIn, (req,res,next)=>{

  // getting userEnteredCode and key that is base32Secret hidden value from the form
  let sixDigitGeneratedToken = req.body.code;
  let secretKeyBase32 = req.body.key;

  var isVerifiedSixDigitGeneratedTokenAndSecretKeyBase32= speakeasy.totp.verify({
    secret: secretKeyBase32,
    encoding: 'base32',
    token: sixDigitGeneratedToken
  })


  if(isVerifiedSixDigitGeneratedTokenAndSecretKeyBase32)
  {
    User.findOneAndUpdate({
      _id: req.user._id
    },
    {
    secretKey: secretKeyBase32,
    },
    function(err, success)
    {
      if(err)
      {
        console.log(err);
      }
      else{
        console.log(success)
      }
    });

    req.session.twoFAAuthenticated = true;
    res.redirect('/loggedIn');
  }

  else{
    req.session.messages = ['Incorrect code or Token, please scan the qr code again and enter the new token or code.'];
    res.redirect('/2FA/');
  }
  


})






module.exports = router;