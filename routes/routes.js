// routes.js

const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager'); // Asegúrate de que la importación sea correcta

// Crear una instancia de ProductManager
const productManager = new ProductManager(/* ruta al archivo de productos */);

// Ruta para obtener todos los productos con límite opcional
router.get('/', (req, res) => {
  const { limit } = req.query;
  const products = productManager.getProducts();

  if (limit) {
    const limitNumber = parseInt(limit, 10);

    if (!isNaN(limitNumber) && limitNumber > 0) {
      // Si el parámetro 'limit' es un número válido y mayor que cero, aplica el límite
      const limitedProducts = products.slice(0, limitNumber);
      res.json(limitedProducts);
    } else {
      res.status(400).json({ error: 'El parámetro "limit" debe ser un número válido mayor que cero.' });
    }
  } else {
    // Si no se proporciona el parámetro 'limit', devuelve todos los productos
    res.json(products);
  }
});

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

// Ruta para agregar un producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const { quantity } = req.body;

  try {
    // Verificar si el producto existe antes de agregarlo al carrito
    const product = productManager.getProductById(productId);

    // Si el producto no existe, lanzar un error
    if (!product) {
      return res.status(404).json({ error: 'El producto no existe.' });
    }

    const cart = cartManager.addProductToCart(cartId, productId, quantity);
    res.json(cart);
  } catch (error) {
    res.status(404).json({ error: error.message });
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
