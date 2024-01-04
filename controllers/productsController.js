// productsController.js
const fs = require('fs').promises;  // Importa el módulo de promesas de fs

const path = require('path');

const productosFilePath = path.join(__dirname, 'files', 'productos.json');
const carritoFilePath = path.join(__dirname, 'files', 'carrito.json');

async function obtenerProductos() {
  try {
    const productosData = await fs.readFile(productosFilePath, 'utf8');
    return JSON.parse(productosData);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
}

async function obtenerProductosDelCarrito() {
  try {
    const carritoData = await fs.readFile(carritoFilePath, 'utf8');
    return JSON.parse(carritoData);
  } catch (error) {
    console.error('Error al obtener productos del carrito:', error);
    throw error;
  }
}

async function agregarProducto(nuevoProducto) {
  try {
    const productosData = await obtenerProductos();
    productosData.push(nuevoProducto);
    await fs.writeFile(productosFilePath, JSON.stringify(productosData, null, 2), 'utf8');
  } catch (error) {
    console.error('Error al agregar producto:', error);
    throw error;
  }
}

async function eliminarProducto(productId) {
  try {
    let productosData = await obtenerProductos();
    const index = productosData.findIndex(producto => producto.id === productId);
    if (index !== -1) {
      productosData.splice(index, 1);
      await fs.writeFile(productosFilePath, JSON.stringify(productosData, null, 2), 'utf8');
    }
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error;
  }
}


module.exports = {
  obtenerProductos,
  obtenerProductosDelCarrito,
  agregarProducto,
  eliminarProducto,
};

  