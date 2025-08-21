const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  // Verifica si el usuario existe en el arreglo users
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  // Verifica si el usuario y contraseña coinciden
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Nombre de usuario y contraseña son requeridos." });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Credenciales inválidas." });
  }
  // Generar JWT
  const accessToken = jwt.sign({ username }, "clave_secreta", { expiresIn: '1h' });
  return res.status(200).json({ message: "Inicio de sesión exitoso.", token: accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Obtener el usuario autenticado desde el JWT
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Token de autenticación requerido." });
  }
  const token = authHeader.split(' ')[1];
  let username;
  try {
    const decoded = jwt.verify(token, "clave_secreta");
    username = decoded.username;
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado." });
  }

  const isbn = req.params.isbn;
  const review = req.query.review;
  if (!review) {
    return res.status(400).json({ message: "La reseña es requerida como query parameter." });
  }
  if (!books[isbn]) {
    return res.status(404).json({ message: "Libro no encontrado para el ISBN proporcionado." });
  }
  // Agregar o modificar la reseña del usuario
  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: "Reseña agregada o modificada exitosamente.", reviews: books[isbn].reviews });
});

// Eliminar una reseña de un libro
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Obtener el usuario autenticado desde el JWT
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Token de autenticación requerido." });
  }
  const token = authHeader.split(' ')[1];
  let username;
  try {
    const decoded = jwt.verify(token, "clave_secreta");
    username = decoded.username;
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado." });
  }

  const isbn = req.params.isbn;
  if (!books[isbn]) {
    return res.status(404).json({ message: "Libro no encontrado para el ISBN proporcionado." });
  }
  if (books[isbn].reviews && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Reseña eliminada exitosamente.", reviews: books[isbn].reviews });
  } else {
    return res.status(404).json({ message: "No existe una reseña de este usuario para este libro." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
