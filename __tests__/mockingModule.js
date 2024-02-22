//mockingModule.js
const express = require('express');
const router = express.Router();
const { generateMockProducts } = require('./mockingUtils');

// Endpoint para generar productos de prueba
router.get('/mockingproducts', (req, res) => {
  const mockProducts = generateMockProducts(100);
  res.json({ products: mockProducts });
});

module.exports = router;
