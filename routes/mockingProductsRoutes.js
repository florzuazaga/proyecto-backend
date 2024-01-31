const express = require('express');
const router = express.Router();
const ProductFactory = require('../services/productFactory'); // Ajusta la ruta según tu estructura

// Ruta para obtener 50 productos generados
router.get('/mockingproducts', (req, res) => {
  console.log('Llamada a /mockingproducts recibida');
  const mockedProducts = ProductFactory.getAllProducts();
  res.json({ products: mockedProducts });
});
module.exports = router;
