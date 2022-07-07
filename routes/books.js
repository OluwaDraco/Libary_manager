var express = require('express');
const { render } = require('../app');
const app = require('../app');
var router = express.Router();
const Book = require("../models").Book;

const Helper = require("./errorHelper")
//function to handle asynchronous calls 
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
        book = await Book.build(req.body)
        res.render('books/new-book',{book,errors:error.errors,title:"New Book"})

      }
      else{
        throw error;
      }
    }
    
  }))
//get book to update
router.get('/:id',asyncHandler(async(req,res,next)=>{
  let book = await Book.findByPk(req.params.id)
  if(book){
    res.render("books/update-book",{book,title:"Update Book"});
  }else{
    err = new Error();
    err.status = 404
    err.message = "sorry page doesn't exist"
    next(err)
  }
}))

  //update book detail form
  router.post('/:id',asyncHandler(async(req,res,next)=>{
    let book = await Book.findByPk(req.params.id)
   await book.update(req.body);
   res.redirect('/')
  }))

  router.get('/:id/delete',asyncHandler(async(req,res,next)=>{
    let book = await Book.findByPk(req.params.id)
    if(book){
    res.render("books/delete",{book,title:"Delete Book"});}
    else{
      res.sendStatus(404)
    }
  }))
   //get book details to delete
   router.post('/:id/delete',asyncHandler(async(req,res,next)=>{
    let book = await Book.findByPk(req.params.id)
    await book.destroy(book);
   res.redirect('/books')
  }))

  module.exports = router;
  
  