// productsRoutes.js
const express = require('express');
const router = express.Router();
const { obtenerProductos, obtenerProductosDelCarrito } = require('../controllers/productsController');

// Importa el objeto io para emitir eventos
const { io } = require('../manager/socketManager');

router.get('/productos', (req, res) => {
  const products = obtenerProductos(); // Lógica para obtener productos
  res.render('home', { products });
});

router.get('/cart', (req, res) => {
  const cartItems = obtenerProductosDelCarrito(); // Lógica para obtener los productos del carrito
  res.render('cart', { items: cartItems });
});

// Ruta para agregar un nuevo producto
router.post('/productos', (req, res) => {
  try {
    // Lógica para agregar el nuevo producto

    // Emite el evento 'new-product' con los datos del nuevo producto
    io.emit('new-product', nuevoProducto);

    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el producto' });
  }
});

// Ruta para eliminar un producto
router.delete('/productos/:pid', (req, res) => {
  try {
    const productId = req.params.pid;

    // Lógica para eliminar el producto

    // Emite el evento 'delete-product' con el ID del producto eliminado
    io.emit('delete-product', productId);

    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

module.exports = router;

