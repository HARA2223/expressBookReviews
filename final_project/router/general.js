const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user: username and password are required." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found for the given ISBN" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let matchingBooks = [];

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].author === author) {
      matchingBooks.push({ isbn: isbn, ...books[isbn] });
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).json({ booksbyauthor: matchingBooks });
  } else {
    return res.status(404).json({ message: "No books found for the given author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let matchingBooks = [];

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].title === title) {
      matchingBooks.push({ isbn: isbn, ...books[isbn] });
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).json({ booksbytitle: matchingBooks });
  } else {
    return res.status(404).json({ message: "No books found for the given title" });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found for the given ISBN" });
  }
});

module.exports.general = public_users;

/* ---------------------------------------------------------------------
   Task 11 — retrieve all books and their details based on author, title
   and ISBN using Axios, implemented both with Promise callbacks and
   with async/await.
--------------------------------------------------------------------- */

const BASE_URL = "http://localhost:5000";

// Get all books — Promise callback style
function getAllBooks() {
  return axios.get(`${BASE_URL}/`)
    .then((response) => {
      console.log("All books:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.log("Error fetching all books:", error.message);
    });
}

// Search by ISBN — Promise callback style
function getBookByISBN(isbn) {
  return axios.get(`${BASE_URL}/isbn/${isbn}`)
    .then((response) => {
      console.log(`Book with ISBN ${isbn}:`, response.data);
      return response.data;
    })
    .catch((error) => {
      console.log(`Error fetching book with ISBN ${isbn}:`, error.message);
    });
}

// Search by Author — async/await style
async function getBookByAuthor(author) {
  try {
    const response = await axios.get(`${BASE_URL}/author/${author}`);
    console.log(`Books by ${author}:`, response.data);
    return response.data;
  } catch (error) {
    console.log(`Error fetching books by ${author}:`, error.message);
  }
}

// Search by Title — async/await style
async function getBookByTitle(title) {
  try {
    const response = await axios.get(`${BASE_URL}/title/${title}`);
    console.log(`Books with title ${title}:`, response.data);
    return response.data;
  } catch (error) {
    console.log(`Error fetching books with title ${title}:`, error.message);
  }
}

module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBookByAuthor = getBookByAuthor;
module.exports.getBookByTitle = getBookByTitle;
