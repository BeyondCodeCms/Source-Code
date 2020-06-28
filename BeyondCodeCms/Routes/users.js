const express = require("express");
const router = express.Router();
const originaltoken = "KLAKLSDAmlad1233A";

var dbConnection = require('../Controller/dbConnection');
router.get("/verifyemail?",(req,res)=>{
    var token = req.query.token;
    console.log(token);
    var username = req.query.username;    
    if(token){
            if(token === originaltoken){
                dbConnection.queryWithParams("select * from users where user_name=?",username).then((data)=>{
                    if(data.length ==0){

                    }
                    else{
                        var currenttime = new Date();
                        console.log("Email sent at = "+data[0].date_created);
                        var emailtime =new Date(data[0].date_created);

                        var diff =(emailtime.getTime() - currenttime.getTime()) / 1000;
                        diff /= 60;
                        var result =  Math.abs(Math.round(diff));
                        console.log("Time Difference = "+result);
                        if(result<=30){
                            var obj = {
                                status:true,
                                verification_status:true,
                            }
                            console.log("Time Passed "+result+ " minutes");
                            dbConnection.queryWithParams("UPDATE `users` SET  ? where user_name = ?",[obj,username]).then((data)=>{
                                req.session.success = true;
                                res.redirect("/index/");
                             }).catch((err)=>{
                                 res.render("404");
                             })
                        }else{
                            res.send("Sorry Link Expired register yourself again");
                        }
                    }
                 }).catch((err)=>{
                     res.render("404");
                 })
            }else{
                res.send("Invalid Token");
            }
        }else{
            res.send("Token Empty");
        }
});

router.get("/accessdashboard",(req,res)=>{
if(req.session.success){
    res.render("userportal");

}else{
    res.redirect('/authentication/login');
}
    });

router.get("/welcomecontents",(req,res)=>{

    res.render("welcome_contents");
});
module.exports =router;