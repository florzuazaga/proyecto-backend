// routes/productsRoutes.js
const express = require('express');
const router = express.Router();
const { obtenerProductos, obtenerProductosDelCarrito } = require('../controllers/productsController');

router.get('/productos', (req, res) => {
  const products = obtenerProductos(); // Lógica para obtener productos
  res.render('home', { products });
});

router.get('/cart', (req, res) => {
  const cartItems = obtenerProductosDelCarrito(); // Lógica para obtener los productos del carrito
  res.render('cart', { items: cartItems });
});

module.exports = router;
