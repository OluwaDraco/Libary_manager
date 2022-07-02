const express = require("express");
const router =  express.Router();

router.use((req,res,next)=>{
    const error = new Error();
    error.status = 404;
    error.message = "sorry there was an error"
    res.status(404).render('error',{error});

})

router.use((err,req,res,next)=>{
    err.status =500;
    err.message = "ERROR!!"
    console.log(err.status,err.message);
    res.render('error',{err});
})

module.exports= router;