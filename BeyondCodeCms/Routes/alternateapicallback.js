const express = require("express");
const router = express.Router();
router.get("/servererror",(req,res)=>{
    res.render("404");
});
router.get("/datanotsaved",(req,res)=>{
    res.render("404");
});

router.get("/authenticated",(req,res)=>{
    res.render("index",{
        checkloginsession:true
    });
});

module.exports = router;