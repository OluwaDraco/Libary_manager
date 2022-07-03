var express = require('express');
const { render } = require('../app');
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
//Displays all the books 
router.get('/',asyncHandler(async(req,res,next)=>{
    let allBooks = await Book.findAll({order:[["createdAt","DESC"]]})
    res.render('books/index',{books:allBooks,title:"Libary Manager"});
  }))

  //get new book form
  router.get('/new',asyncHandler(async(req,res,next)=>{
    res.render('books/new-book',{book:{},title:'New Book'})
  }))

  //Post new book
  router.post('/new',asyncHandler(async(req,res,next)=>{
    let book 
    try{
      book = await Book.create(req.body)
      res.redirect('/')


    }catch(error){
      if(error.name === "SequelizeValidationError"){
        book = await Book.bulid(req.body)
        res.render('books/new-book',{book,error:error.errors,title:"New Book"})

      }
    }
    
  }))
//get book to update
router.get('/:id',asyncHandler(async(req,res,next)=>{
  let book = await Book.findByPk(req.params.id)
  res.render("books/book-update",{book,title:"udate book"});
}))

  //update book detail form
  router.post('/:id',asyncHandler(async(req,res,next)=>{
    let book = await Book.findByPk(req.params.id)
   await book.update(req.body);
   res.redirect('/')
  }))

  router.get('/:id/delete',asyncHandler(async(req,res,next)=>{
    let book = await Book.findByPk(req.params.id)
    res.render("books/delete",{book,title:"Delete book"});
  }))
   //get book detail to delete
   router.post('/:id/delete',asyncHandler(async(req,res,next)=>{
    let book = await Book.findByPk(req.params.id)
    await book.destroy(book);
   res.redirect('/books')
  }))

  module.exports = router;
  
  