// mockingProductsRoutes.js
const express = require('express');
const router = express.Router();
const ProductFactory = require('../services/productFactory');

// Ruta para obtener 50 productos generados
router.get('/mockingproducts', (req, res) => {
  console.log('Llamada a /mockingproducts recibida');
  const mockedProducts = ProductFactory.getAllProducts().slice(0, 50); // Limita la respuesta a 50 productos
  res.json({ products: mockedProducts });
});

module.exports = router;

