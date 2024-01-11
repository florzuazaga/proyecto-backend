// cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// DELETE para eliminar un producto del carrito
router.delete('/:cid/products/:pid', cartController.deleteProductFromCart);

// PUT para actualizar todo el carrito con un arreglo de productos
router.put('/:cid', cartController.updateCart);

// PUT para actualizar la cantidad de ejemplares de un producto en el carrito
router.put('/:cid/products/:pid', cartController.updateProductQuantity);

// DELETE para eliminar todos los productos del carrito
router.delete('/:cid', cartController.clearCart);

// GET para obtener el carrito con productos completos utilizando populate
router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;

  try {
    const populatedCart = await Cart.findById(cartId).populate('products');

    if (!populatedCart) {
      return res.status(404).json({ status: 'error', error: 'Carrito no encontrado.' });
    }

    res.json({ status: 'success', cart: populatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
});

module.exports = router;



