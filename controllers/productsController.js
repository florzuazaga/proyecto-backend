// productsController.js
const fs = require('fs');
const path = require('path');

// Imagina que tienes una variable que contiene datos de productos
const productosData = [
    { id: 1, nombre: 'Producto 1', precio: 10, tipo: 'tipo1' },
    { id: 2, nombre: 'Producto 2', precio: 20, tipo: 'tipo2' },
    
  ];
  
  // Función para obtener todos los productos
  function obtenerProductos() {
    const productosData = JSON.parse(fs.readFileSync(path.join(__dirname, 'files', 'productos.json'), 'utf8'));
  return productosData;
  }
  
  // Función para obtener un producto por su ID
  function obtenerProductoPorId(productId) {
    return productosData.find(producto => producto.id === productId);
  }
  
  // Función para agregar un nuevo producto
  function agregarProducto(nuevoProducto) {
    productosData.push(nuevoProducto);
  }
  
  // Función para eliminar un producto por su ID
  function eliminarProducto(productId) {
    const index = productosData.findIndex(producto => producto.id === productId);
    if (index !== -1) {
      productosData.splice(index, 1);
    }
  }
  function obtenerProductosDelCarrito() {
    const carritoData = JSON.parse(fs.readFileSync(path.join(__dirname, 'files', 'carrito.json'), 'utf8'));
    return carritoData;
  }
  
  // Exporta las funciones para que puedan ser utilizadas en otros archivos
  module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    obtenerProductosDelCarrito,
    agregarProducto,
    eliminarProducto,
  };
  