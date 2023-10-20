// routes.js
const express = require('express');
const router = express.Router();
//Se importa la instancia de productManager
const productmanager = require('./productManager'); // ruta correcta de  archivo principal

// Ruta raíz para obtener todos los productos
router.get('/', (req, res) => {
    const limit = req.query.limit;
    let products = productmanager.getProducts();
  
    if (limit) {
      products = products.slice(0, parseInt(limit));
    }
  
    res.json(products);
  });

router.get('/:pid', (req, res) => {
  //Se implementa la lógica para obtener un producto específico por ID
  const productId = parseInt(req.params.id);

const product = productmanager.getProductById(productId);

if (product) {
    res.json(product);
  } else {
    // Si el producto no se encuentra, devuelve un error 404
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

module.exports = router;
