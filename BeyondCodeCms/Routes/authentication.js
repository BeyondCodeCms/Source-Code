const express = require("express");
const router = express.Router();
const token = "KLAKLSDAmlad1233A";
var nodemailer = require('nodemailer');
var dbConnection = require('../Controller/dbConnection');
var passport = require('passport');
router.get("/signup",(req,res)=>{
    res.render("signup",{
        shouldShowAlert : false,
        passerror:false,
        message  : "",
        alertClass : "",
        firstname:'',
        lastname:'',
        email:'',
        username:'',
        hintusername:'Enter username',                             
        hintfname:'Firstname',
        hintlname:'Lastname',
        hintemail:'Email',
        error:'',
        checksession:false,
    });
});

router.post("/signup",(req,res)=>{
        var firstname,lastname,email,username,password,repassword,status,ver_status,date_created,profile_pic;

        firstname = req.body.firstname;
        lastname = req.body.lastname;
        email = req.body.email;
        username = req.body.username;
        password = req.body.pass;
        repassword = req.body.repass;
        status = false;
        ver_status = false;
        profile_pic = "../assets/images/user.png"
        var d = new Date();
        date_created=d
        
        
       if(password.length<8){
        res.render("signup",{
            shouldShowAlert : false,
            message  : "",
            alertClass : "",
            firstname:firstname,
            lastname:lastname,
            email:email,
            username:username,
            hintfname:'',
            hintlname:'',
            hintemail:'',
            hintusername:'',
            passerror:true,
            error:"Minimum 8 characters required",
            checksession:false,
        });
       }else{
        if(password == repassword){
           

            dbConnection.queryWithParams("select * from users where email =?",email).then((data)=>{
                
              if(data.length == 0)
                {
                  dbConnection.queryWithParams("select * from users where user_name =?",username).then((data)=>{

                    if(data.length== 0){
                      console.log("Api Called");
                      var ob = {
                        firstname:firstname,
                        lastname:lastname,
                        email:email,
                        user_name:username,
                        user_pass:password,
                        status:status,
                        verification_status:ver_status,
                        date_created:date_created,
                        profile_picture:profile_pic
                    }; 
                    var url ="http://localhost:3004/userportal/verifyemail?token="+token+"&"+"username="+username;
                    

                    let transporter = nodemailer.createTransport({
                      service: 'gmail',
                      host: "smtp.ethereal.email",
                      port: 587,
                      secure: false, // true for 465, false for other ports
                      auth: {
                          user: 'mystudymanger@gmail.com',
                          pass: 'knightkingalpha'
                        },
                    });
                          
                          var mailOptions = {
                            from: 'mystudymanger@gmail.com',
                            to: email,
                            subject: 'Verfication Link',
                            text: "Please use this link within 30 minutes"+"\n"+url
                          };
                          
                          transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                              res.render("404");
                            } else {
                              console.log('Email sent: ' + info.response);
                              dbConnection.queryWithParams("insert into users set ?",ob).then((data)=>{
                                res.render("signup",{
                                    shouldShowAlert : true,
                                    message  : "Check your email address for verification link",
                                    alertClass : "alert alert-success",
                                    firstname:'',
                                    lastname:'',
                                    email:'',
                                    username:'',

                                    hintfname:'Firstname',
                                    hintlname:'Lastname',
                                    hintemail:'Email',
                                    hintusername:'Username',
                                    passerror:false,
                                    error:"",
                                    checksession:false,
                                });
                             }).catch((err)=>{
                               console.log(err);
                                res.render("signup",{
                                    shouldShowAlert : true,
                            message  : "Error ! Data not saved.",
                            alertClass : "alert alert-danger",
                            firstname:firstname,
                            lastname:lastname,
                            email:email,
                            username:username,

                            hintfname:'',
                            hintlname:'',
                            hintemail:'',
                            hintusername:'',
                            passerror:false,
                            error:"",
                            checksession:false,
                          });

                             });
                            }
                          }); 
                    


                    }else{
                      res.render("signup",{
                        shouldShowAlert : true,
                        message  : "Error ! Username is already in use.Please try a different one",
                        alertClass : "alert alert-danger",
                        firstname:firstname,
                        lastname:lastname,
                        email:email,
                        username:'',
                        hintfname:'',
                        hintlname:'',
                        hintemail:'',
                        hintusername:'Username',
                        passerror:false,
                        error:"",
                        checksession:false,
              });
                    }
                  }).catch((err)=>{
                    console.log(err);
                    res.send({
                      
                        message:"internal server error"
                    });
                });

                }else{
                    res.render("signup",{
                        shouldShowAlert : true,
                        message  : "Error ! Email is already in use.",
                        alertClass : "alert alert-danger",
                        firstname:firstname,
                        lastname:lastname,
                        email:'',
                        username:username,
                        hintfname:'',
                        hintlname:'',
                        hintemail:'Enter Email',
                        hintusername:'',
                        passerror:false,
                        error:"",
                        checksession:false,
              });
                }
             }).catch((err)=>{
              console.log(err);   
              res.send({
                     message:"internal server error"
                 });
             });
            

        }
          else{
              res.render("signup",{
                shouldShowAlert : true,
                message  : "Error ! password does not match",
                alertClass : "alert alert-danger",
                firstname:firstname,
                lastname:lastname,
                email:email,
                username:username,
                hintfname:'',
                hintlname:'',
                hintemail:'',
                hintusername:'',
                passerror:false,
                error:"",
                checksession:false,
              });
          }
        }
    
    
    
    
});

router.get("/login",(req,res)=>{
  if(req.session.success){
    console.log(req.session.success);
    res.render("index",{
      checkloginsession:true
  });
  }else{
    console.log(req.session.success);
    res.render("login",{
      shouldshowalert : false,
      message  : "",
      alertClass : "",
  });
  }
   
  
  
 
});
router.get("/logout",(req,res,next)=>{
  req.session.destroy();
  res.render("login",{
    shouldshowalert:false,
    message:""
});
});
router.post("/login",(req,res)=>{
    var username = req.body.username;
    var password = req.body.password;
    var status = true;
 dbConnection.queryWithParams("select * from users where user_name = ? AND user_pass =? ",[username,password]).then((data)=>{
   if(data.length == 0){
     req.session.success = false;
    res.render("login",{
        shouldshowalert:true,
        message:"username/password is wrong",
        alertClass : "alert alert-danger"
    });
   }else{
        if(data[0].verification_status){
          req.session.success = true;
              res.redirect("/userportal/welcomecontents");
        }else{
          req.session.success = false;
          res.render("login",{
              shouldshowalert:true,
              message:"please verify your email through the link we mailed you",
              alertClass : "alert alert-danger"
          });
        }
  
   
   }
    
    }).catch((err)=>{
     res.render("404");
     console.log(err);
 });


});
router.get("/google",passport.authenticate('google',{
  scope:['profile','email']
}));
router.get("/google/redirect",passport.authenticate('google'),(req,res)=>{
  console.log("You are redirected to Google Successfully");
  var d = new Date();
        date_created=d
  var firstname,lastname,email,username,status,ver_status,date_created,profile_pic,g_id;

  firstname = req.user.givenname;
  lastname = req.user.family_name;
  username = req.user.email;
  status = true;
  ver_status=true;
  date_created=date_created;
  profile_pic=req.user.picture;
  g_id=req.user.g_id;
  email = req.user.email;

  dbConnection.queryWithParams("select * from users where email =?",email).then((data)=>{
                
    if(data.length == 0)
      {
            var ob = {
              firstname:firstname,
              lastname:lastname,
              email:email,
              user_name:username,
               status:status,
              verification_status:ver_status,
              date_created:date_created,
              profile_picture:profile_pic,
              g_id:g_id
          }; 
         
                     dbConnection.queryWithParams("insert into users set ?",ob).then((data)=>{
                      req.session.success = true;
                      res.redirect("/alternateresponse/authenticated");
                   }).catch((err)=>{
                     console.log(err);
                     res.redirect("/alternateresponse/servererror");

                   });
        

      }else{
        res.redirect("/alternateresponse/servererror");
      }
   }).catch((err)=>{
    console.log(err);   
    res.redirect("/alternateresponse/servererror");
   });
});

router.get("/facebook",passport.authenticate('facebook',{
  scope:['profile']
}));

router.get("/facebook/redirect",passport.authenticate('facebook'),(req,res)=>{
  console.log("You are redirected to faebook Successfully");
  
});
module.exports =router;