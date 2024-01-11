//cartRoutes.js
const express = require('express');
const router = express.Router();
const cartsController = require('../controllers/cartsController');

// DELETE para eliminar un producto del carrito
router.delete('/carts/:cid/products/:pid', cartsController.eliminarProductoDelCarrito);

// PUT para actualizar todo el carrito
router.put('/carts/:cid', cartsController.actualizarCarrito);

// PUT para actualizar la cantidad de ejemplares de un producto en el carrito
router.put('/carts/:cid/products/:pid', cartsController.actualizarCantidadProductoEnCarrito);

module.exports = router;

