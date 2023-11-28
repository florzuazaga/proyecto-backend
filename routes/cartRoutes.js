const express = require('express');
const router = express.Router();
const CartManager = require('../managers/CartManager');
const Product = require('../dao/models/Product'); // Reemplaza con la ubicación correcta y nombre del modelo Product
const Cart = require('../dao/models/Cart'); // Reemplaza con la ubicación correcta y nombre del modelo Cart

// Crear instancia de CartManager
const cartManager = new CartManager('../managers/CartManager');

router.get('/:cid', (req, res) => {
  // Obtener un carrito específico con sus productos completos mediante "populate"
  const cartId = req.params.cid;
  
  try {
    Cart.findById(cartId).populate('products').exec((err, cart) => {
      if (err || !cart) {
        return res.status(404).json({ error: 'Carrito no encontrado.' });
      }
      res.json(cart);
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito.' });
  }
});

router.delete('/:cid/products/:pid', (req, res) => {
  // Eliminar del carrito el producto seleccionado
  const cartId = req.params.cid;
  const productId = req.params.pid;

  try {
    const updatedCart = cartManager.removeProductFromCart(cartId, productId);
    res.json(updatedCart);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.put('/:cid', (req, res) => {
  // Actualizar el carrito con un arreglo de productos
  const cartId = req.params.cid;
  const updatedProducts = req.body.products;

  try {
    const updatedCart = cartManager.updateCart(cartId, updatedProducts);
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:cid/products/:pid', (req, res) => {
  // Actualizar la cantidad de ejemplares del producto en el carrito
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const { quantity } = req.body;

  try {
    const updatedCart = cartManager.updateProductQuantity(cartId, productId, quantity);
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:cid', (req, res) => {
  // Eliminar todos los productos del carrito
  const cartId = req.params.cid;

  try {
    cartManager.clearCart(cartId);
    res.json({ message: 'Carrito vaciado exitosamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
