var express = require('express');
var app = express();
var EJS  = require('ejs');
var path = require('path');
const http = require('http').Server(app);
const bodyParser = require("body-parser");
const session = require('express-session');
const passportSetup= require('./config/google-passport-setup');
const passportSetup2= require('./config/facebook-passport-setup');

const passport = require('passport');
app.set('port',process.env.PORT || 3004);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use(passport.initialize());

app.set('views', path.join(__dirname, 'views'));

app.engine('html', EJS.renderFile);


 
  app.use(session({
    
    secret: 'XASDASDA',
    
    resave: false,
    saveUninitialized: false,
    rolling: true
  }));

  var checker = (req,res,next) => {
   
    if(req.session.success){
        next();
    }else{
     
        res.redirect("/authentication/login");
    }

};


app.use("/index", require("./Routes/homepage"));
app.use("/authentication", require("./Routes/authentication"));
app.use("/userportal", require("./Routes/users"));
app.use("/alternateresponse",require("./Routes/alternateapicallback"));
app.use("/feedback",require("./Routes/feedback"));
app.use((req,res,next)=>{
    const error = new Error('Requested Resource not found');
    console.log(req.url);
    error.status = 400;
    next(error);
  });
  
  app.use((error,req,res,next)=>{
    console.log(error.message);
   
  });
  
http.listen(app.get('port'),()=>{
    console.log('server is running on port',app.get('port'));
  });