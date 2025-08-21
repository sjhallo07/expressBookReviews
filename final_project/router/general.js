// Ejemplo: Obtener detalles de libros por título usando Axios y async/await
// const axios = require('axios');
// async function getBooksByTitle(title) {
//   try {
//     const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`); // Cambia el puerto si tu servidor usa otro
//     console.log('Libros con ese título:', response.data);
//   } catch (error) {
//     console.error('Error al obtener los libros por título:', error.message);
//   }
// }
// getBooksByTitle('Things Fall Apart');
// Ejemplo: Obtener detalles de libros por autor usando Axios y async/await
// const axios = require('axios');
// async function getBooksByAuthor(author) {
//   try {
//     const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`); // Cambia el puerto si tu servidor usa otro
//     console.log('Libros del autor:', response.data);
//   } catch (error) {
//     console.error('Error al obtener los libros por autor:', error.message);
//   }
// }
// getBooksByAuthor('Jane Austen');
// Ejemplo: Obtener detalles de un libro por ISBN usando Axios y async/await
// const axios = require('axios');
// async function getBookByISBN(isbn) {
//   try {
//     const response = await axios.get(`http://localhost:5000/isbn/${isbn}`); // Cambia el puerto si tu servidor usa otro
//     console.log('Detalles del libro:', response.data);
//   } catch (error) {
//     console.error('Error al obtener el libro:', error.message);
//   }
// }
// getBookByISBN('1');
// Ejemplo: Obtener la lista de libros usando Axios y async/await
// const axios = require('axios');
// async function getBooksList() {
//   try {
//     const response = await axios.get('http://localhost:5000/'); // Cambia el puerto si tu servidor usa otro
//     console.log('Lista de libros:', response.data);
//   } catch (error) {
//     console.error('Error al obtener la lista de libros:', error.message);
//   }
// }
// getBooksList();
const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Tarea 1: Obtener la lista de libros disponibles
public_users.get('/', function (req, res) {
  return res.status(200).json(JSON.parse(JSON.stringify(books, null, 2)));
});

// Tarea 2: Obtener detalles del libro por ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Libro no encontrado" });
  }
});

// Tarea 3: Obtener detalles del libro por autor
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author === author);
  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No se encontraron libros para ese autor" });
  }
});

// Tarea 4: Obtener detalles del libro por título
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(book => book.title === title);
  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: "No se encontraron libros con ese título" });
  }
});

// Tarea 5: Obtener reseñas del libro por ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Libro no encontrado" });
  }
});

// Tarea 6: Registrar un nuevo usuario
const isValid = (username) => {
  return users.some(user => user.username === username);
};

public_users.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Nombre de usuario y contraseña son requeridos." });
  }
  if (isValid(username)) {
    return res.status(409).json({ message: "El usuario ya existe." });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "Usuario registrado exitosamente." });
});

module.exports.general = public_users;
