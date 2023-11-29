// routes.js

const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager'); 
const CartManager = require('../managers/CartManager'); 
const Product = require('../dao/models/ProductSchema');
const Cart = require('../dao/models/cartSchema');

// Crear una instancia de ProductManager
const productManager = new ProductManager();
const cartManager = new CartManager();


// Ruta para visualizar todos los productos con paginación
router.get('/products', async (req, res) => {
  try {
    const products = await ProductManager.getAllProducts();
    res.render('products', { products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Ruta para obtener todos los productos con límite opcional
router.get('/api/products', (req, res) => {
  try {
    const { limit } = req.query;
    let products = productManager.getProducts();

    if (limit) {
      const limitNumber = parseInt(limit, 10);

      if (!isNaN(limitNumber) && limitNumber > 0) {
        products = products.slice(0, limitNumber);
      } else {
        return res.status(400).json({ error: 'El parámetro "limit" debe ser un número válido mayor que cero.' });
      }
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
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
