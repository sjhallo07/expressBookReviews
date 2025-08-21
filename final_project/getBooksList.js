const axios = require('axios');

// Obtener la lista de libros usando async/await y Axios
async function getBooksList() {
  try {
    const response = await axios.get('http://localhost:5000/'); // Cambia el puerto si tu servidor usa otro
    console.log('Lista de libros:', response.data);
  } catch (error) {
    console.error('Error al obtener la lista de libros:', error.message);
  }
}

getBooksList();
