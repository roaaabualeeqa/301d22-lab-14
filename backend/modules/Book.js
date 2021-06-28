'use strict';

const handleServerError = require('./500-ServerError');
const User = require('../models/Users');
// User.collection.drop();


const Book = { }

Book.list = 
  async(request, response) => {
    const email = request.query.email;
    // get the books from mongo 
    await User.find({ email }, (err, user) => {
      if (err) return console.error(err);
      // if the user isn't in the db, add them
      if(!user.length){
        user[0] = { email, books: [] }
        const newUser = new User(user[0])
        newUser.save();
      }

      response.send(user[0].books);
    })
  };

Book.add = 
  async (request, response) => {
    const { email, name, description, status } = request.body;
    const newBook = {name, description, status};

    await User.findOne({ email }, (err, user) => {
      if (err) console.error(err);
      user.books.push(newBook);
      user.save().then(response.send(user.books)).catch(err => handleServerError(request, response, err))
    });
  };

Book.delete =
  async(request, response) => {
    // delete a book from Mongo
    const email = request.query.email;
    const id = Number(request.params.id);
    await User.findOne({email}, (err, user) => {
      const newBookArray = user.books.filter(book => book.id !== id);
      user.books = newBookArray;
      user.save();
      response.status(200).send('success');
    });
  }

Book.update = 
  async(request, response) => {
    // updates a book in Mongo
    const { email, name, description, status } = request.body;
    const index = Number(request.params.id);
    console.log({index, email, name, description, status})

    await User.findOne({ email }, (err, user) => {
      if (err) console.error(err);
      const newBookArray = user.books.map((book, i) =>  {
        return i === index ? book = { name, description, status } : book;
      });
      user.books = newBookArray;
      console.log({newBookArray})
      user.save();
      response.status(200).send(newBookArray);
    })
  }

module.exports = Book;