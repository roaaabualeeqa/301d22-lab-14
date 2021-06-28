'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); 

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/favoriteBooks', {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we\'re connected!');
});

const handleNotFound = require('./modules/404-NotFound');
const Book = require('./modules/Book.js');

const PORT = process.env.PORT || 3001;

app.get('/books', Book.list);
app.post('/books', Book.add);
app.delete('/books/:id', Book.delete);
app.put('/books/:id', Book.update);
app.use('*', handleNotFound);

app.listen(PORT, () => console.log(console.log(`listening on ${PORT}`)));