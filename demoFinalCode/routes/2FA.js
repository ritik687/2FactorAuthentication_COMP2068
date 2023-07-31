var express = require('express')
var router = express.Router();

// importing the User model for authentication
const User = require('../models/user');


// importing  npm module -- npm i  speakeasy
var speakeasy = require("speakeasy");




function isUserLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

router.get('/', isUserLoggedIn, (req,res,next)=>{

        var secretKeyObject = speakeasy.generateSecret({
          name: req.user.username
      });

      var otpURL = secretKeyObject.otpauth_url + '&period=30';
      
      // console.log(secretKeyObject);
      // console.log(otpURL);
     

      var qrImageString = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(otpURL);

      // console.log(encodeURIComponent(otpURL));

      let messages = req.session.messages || [];
      req.session.messages = [];

      res.render('2FA/index',{
        Title: 'Google-Authentication',
        title: 'Google-Authentication',
        user: req.user,
        qrImage: qrImageString,
        secretKey: secretKeyObject.base32,
        messages: messages
      });

});


router.post('/', isUserLoggedIn, (req,res,next)=>{

  // getting userEnteredCode and key that is base32Secret hidden value from the form
  let sixDigitGeneratedToken = req.body.enteredCode;
  let secretKeyBase32 = req.body.key;

  // console.log(sixDigitGeneratedToken +"\n"+ secretKeyBase32);

  let isVerifiedSixDigitGeneratedTokenAndSecretKeyBase32 = speakeasy.totp.verify({
    secret: secretKeyBase32,
    encoding: 'base32',
    token: sixDigitGeneratedToken
  });

  // console.log(isVerifiedSixDigitGeneratedTokenAndSecretKeyBase32);


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

    req.session.twoFAuthenticated = true;
    res.redirect('/loggedIn');
  }

  else{
    req.session.messages = ['Incorrect code or token, please scan the qr code again and enter the new token or code.'];
    res.redirect('/2FA/');
  }
  
});






router.get('/verify', isUserLoggedIn, (req,res,next)=>{

  let messages = req.session.messages || [];
      req.session.messages = [];

  
  res.render('2FA/verify',
  {
    Title: "Google-Authentication",
    title: "Google-Authentication",
    user: req.user,
    messages: messages
  }
  );

  
  
});


router.post('/verify', (req, res, next)=>{

  let sixDigitGeneratedToken = req.body.enteredCode;
  let secretKeyBase32 = req.user.secretKey;

  console.log(sixDigitGeneratedToken+"\n"+ secretKeyBase32);

  let isVerifiedSixDigitGeneratedTokenAndSecretKeyBase32 = speakeasy.totp.verify({
    secret: secretKeyBase32,
    encoding: 'base32',
    token: sixDigitGeneratedToken
  })

  console.log(isVerifiedSixDigitGeneratedTokenAndSecretKeyBase32)


  if(isVerifiedSixDigitGeneratedTokenAndSecretKeyBase32)
  {
   req.session.twoFAuthenticated = true;
   res.redirect('/loggedIn');
  }

  else{
    req.session.messages = ['Incorrect code'];
    res.redirect('/2FA/verify');
    
  }

  
});


module.exports = router;