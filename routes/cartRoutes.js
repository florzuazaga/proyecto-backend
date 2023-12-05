const express = require('express');
const router = express.Router();
const CartManager = require('../managers/CartManager');
const Product = require('../dao/models/Product'); 
const Cart = require('../dao/models/Cart'); 


// Crear instancia de CartManager
const cartManager = new CartManager(); 



router.post('/:cid/products/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const { quantity } = req.body;

  try {
    // lógica para encontrar el carrito por ID
    const cart = cartManager.findCartById(cartId);

    // Comprueba si el producto ya está en el carrito
    const existingProductIndex = cart.products.findIndex(product => product.productId === productId);

    if (existingProductIndex !== -1) {
      // Si el producto ya está en el carrito, aumenta la cantidad
      cart.products[existingProductIndex].quantity += parseInt(quantity);
    } else {
      // Si no está en el carrito, agrégalo con la cantidad proporcionada
      cart.products.push({ productId, quantity: parseInt(quantity) });
    }


    // Luego, envía una respuesta exitosa
    res.status(200).json({ message: 'Producto agregado al carrito exitosamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
