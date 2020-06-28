const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const keys = require('./keys');
const dbConnection = require('../Controller/dbConnection');


passport.serializeUser((user,done)=>{
    done(null, user);
});
passport.deserializeUser((user,done)=>{
    done(null, user);
});
passport.use(new FacebookStrategy({
    
    clientID:keys.facebook.clientID,
    clientSecret:keys.facebook.clientSecret,
    callbackURL:'/authentication/facebook/redirect'
},(accessToken,RefreshToken,profile,done)=>{
    console.log("Redirect Method Called");
    console.log(profile);
    //console.log(profile._json.email);
    
})
);