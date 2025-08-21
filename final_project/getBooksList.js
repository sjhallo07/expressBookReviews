const axios = require('axios');

// Tarea 10: Obtener la lista de libros (async/await)
async function getBooksList() {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log('Lista de libros:', response.data);
  } catch (error) {
    console.error('Error al obtener la lista de libros:', error.message);
  }
}

// Tarea 11: Obtener detalles del libro por ISBN (async/await)
async function getBookByISBN(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log('Detalles del libro:', response.data);
  } catch (error) {
    console.error('Error al obtener el libro:', error.message);
  }
}

// Tarea 12: Obtener detalles del libro por autor (async/await)
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
    console.log('Libros del autor:', response.data);
  } catch (error) {
    console.error('Error al obtener los libros por autor:', error.message);
  }
}

// Tarea 13: Obtener detalles del libro por título (async/await)
async function getBooksByTitle(title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
    console.log('Libros con ese título:', response.data);
  } catch (error) {
    console.error('Error al obtener los libros por título:', error.message);
  }
}

// Ejemplo de uso:
getBooksList();
getBookByISBN('1');
getBooksByAuthor('Jane Austen');
getBooksByTitle('Things Fall Apart');
