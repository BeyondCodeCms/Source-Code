const express = require("express");
const router = express.Router();


router.get("/",(req,res)=>{
   if(req.session.success){
    res.render("index",{
        checkloginsession:true
    });
   }else{
    res.render("index",{
        checkloginsession:false
    });

   }
    });

router.get("/blog",(req,res)=>{
    res.render("single",{
        checkloginsession:false
    });
});

module.exports =router;