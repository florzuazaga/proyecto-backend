// routes.js

const express = require('express');
const router = express.Router();
const ProductManager = require('./ProductManager'); // Asegúrate de que la importación sea correcta

// Crear una instancia de ProductManager
const productManager = new ProductManager(/* ruta al archivo de productos */);

// Definir rutas
router.get('/', (req, res) => {
  // Ruta para mostrar todos los productos
  const products = productManager.getProducts();
  res.json(products);
});

router.get('/:pid', (req, res) => {
  // Ruta para mostrar un producto por su ID
  const productId = req.params.pid;
  try {
    const product = productManager.getProductById(productId);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});


module.exports = router;
