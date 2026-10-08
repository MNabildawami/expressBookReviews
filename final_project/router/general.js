const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (users.some((user) => user.username === username)) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(201).json({
    message: "User successfully registered"
  });
});

// Internal API for retrieving all books
public_users.get('/api/books', async (req, res) => {
  try {
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books"
    });
  }
});

// Get all books using Axios
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/api/books');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books"
    });
  }
});

// Get book by ISBN using Axios
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/api/books');
    const isbn = req.params.isbn;

    if (response.data[isbn]) {
      return res.status(200).json(response.data[isbn]);
    }

    return res.status(404).json({
      message: "Book not found"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving book"
    });
  }
});

// Get books by author using Axios
public_users.get('/author/:author', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/api/books');
    const author = req.params.author;
    const result = {};

    for (const key in response.data) {
      if (
        response.data[key].author.toLowerCase() ===
        author.toLowerCase()
      ) {
        result[key] = response.data[key];
      }
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books"
    });
  }
});

// Get books by title using Axios
public_users.get('/title/:title', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/api/books');
    const title = req.params.title;
    const result = {};

    for (const key in response.data) {
      if (
        response.data[key].title.toLowerCase() ===
        title.toLowerCase()
      ) {
        result[key] = response.data[key];
      }
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books"
    });
  }
});

// Get reviews by ISBN
public_users.get('/review/:isbn', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/api/books');
    const isbn = req.params.isbn;

    if (response.data[isbn]) {
      return res.status(200).json(response.data[isbn].reviews);
    }

    return res.status(404).json({
      message: "Book not found"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving reviews"
    });
  }
});

module.exports.general = public_users;