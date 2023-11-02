// routes.js

const express = require('express');
const router = express.Router();
const ProductManager = require('./ProductManager'); // Asegúrate de que la importación sea correcta

// Crear una instancia de ProductManager
const productManager = new ProductManager(/* ruta al archivo de productos */);

// Ruta para crear un nuevo producto
router.post('/', (req, res) => {
  try {
    const { name, price, code } = req.body;

    // Validación de campos obligatorios
    if (!name || !price || !code) {
      return res.status(400).json({ error: 'Nombre, precio y código son campos obligatorios.' });
    }

    // Validación de campo code único
    const existingProduct = productManager.getProducts().find((product) => product.code === code);
    if (existingProduct) {
      return res.status(400).json({ error: 'El código del producto ya existe.' });
    }

    const newProduct = productManager.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

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
