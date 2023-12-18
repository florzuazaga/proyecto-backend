const fs = require('fs');
const path = require('path');

function obtenerProductos() {
  const productosData = JSON.parse(fs.readFileSync(path.join(__dirname, 'files', 'productos.json'), 'utf8'));
  return productosData; // Devuelve los productos obtenidos del archivo JSON
}

module.exports = { obtenerProductos };
