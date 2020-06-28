const express = require("express");
const router = express.Router();
const dbConnection = require("../Controller/dbConnection");
router.post("/postcomment?",(req,res)=>{
res.send("respomse recieved");
   
});

module.exports = router;