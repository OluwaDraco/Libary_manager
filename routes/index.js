var express = require('express');
const app = require('../app');
var router = express.Router();
const Book = require("../models").Book;

const Helper = require("./errorHelper")



function asyncHandler(cb){
  return async(req,res,next)=>{
      try{
          await cb(req,res,next)
      }
      catch(error){
          res.status(500).send(error);
      }
  }

}


/* GET home page. */
router.get('/', asyncHandler(async(req, res)=> {
   res.redirect('/books');
}));

module.exports = router




