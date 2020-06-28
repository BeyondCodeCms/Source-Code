const passport = require('passport');
const GoolgeStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const dbConnection = require('../Controller/dbConnection');


passport.serializeUser((user,done)=>{
    done(null, user);
});
passport.deserializeUser((user,done)=>{
    done(null, user);
});
passport.use(new GoolgeStrategy({
    
    clientID:keys.google.clientID,
    clientSecret:keys.google.clientSecret,
    callbackURL:'/authentication/google/redirect'
},(accessToken,RefreshToken,profile,done)=>{
    console.log("Redirect Method Called");
    //console.log(profile);
    console.log(profile._json.email);
    var user ={
        g_id:profile._json.sub,
        name:profile._json.name,
        givenname:profile._json.given_name,
        family_name:profile._json.family_name,
        picture:profile._json.picture,
        email:profile._json.email
    }
    done(null, user);
    
})
);