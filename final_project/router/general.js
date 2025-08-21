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
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({message: "Libro no encontrado para el ISBN proporcionado."});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Async: obtener todos los libros
  (async () => {
    try {
      const allBooks = await new Promise((resolve) => resolve(books));
      return res.status(200).json(allBooks);
    } catch (err) {
      return res.status(500).json({ message: "Error al obtener los libros." });
    }
  })();
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // Async: obtener libro por ISBN
  (async () => {
    try {
      const isbn = req.params.isbn;
      const book = await new Promise((resolve) => resolve(books[isbn]));
      if (book) {
        return res.status(200).json(book);
      } else {
        return res.status(404).json({message: "Libro no encontrado para el ISBN proporcionado."});
      }
    } catch (err) {
      return res.status(500).json({ message: "Error al obtener el libro." });
    }
  })();
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  // Async: obtener libros por autor
  (async () => {
    try {
      const author = req.params.author;
      const booksByAuthor = await new Promise((resolve) => {
        resolve(
          Object.entries(books)
            .filter(([isbn, book]) => book.author.toLowerCase() === author.toLowerCase())
            .map(([isbn, book]) => ({ isbn, ...book }))
        );
      });
      if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor);
      } else {
        return res.status(404).json({message: "No se encontraron libros para el autor proporcionado."});
      }
    } catch (err) {
      return res.status(500).json({ message: "Error al obtener los libros por autor." });
    }
  })();
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  // Async: obtener libros por título
  (async () => {
    try {
      const title = req.params.title;
      const booksByTitle = await new Promise((resolve) => {
        resolve(
          Object.entries(books)
            .filter(([isbn, book]) => book.title.toLowerCase() === title.toLowerCase())
            .map(([isbn, book]) => ({ isbn, ...book }))
        );
      });
      if (booksByTitle.length > 0) {
        return res.status(200).json(booksByTitle);
      } else {
        return res.status(404).json({message: "No se encontraron libros para el título proporcionado."});
      }
    } catch (err) {
      return res.status(500).json({ message: "Error al obtener los libros por título." });
    }
  })();
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Async: obtener reseñas por ISBN
  (async () => {
    try {
      const isbn = req.params.isbn;
      const book = await new Promise((resolve) => resolve(books[isbn]));
      if (book) {
        return res.status(200).json(book.reviews);
      } else {
        return res.status(404).json({message: "Libro no encontrado para el ISBN proporcionado."});
      }
    } catch (err) {
      return res.status(500).json({ message: "Error al obtener las reseñas." });
    }
  })();
});

module.exports.general = public_users;
