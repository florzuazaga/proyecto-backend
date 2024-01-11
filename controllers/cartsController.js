// cartController.js
const Cart = require('../dao/models/cartSchema');
const Product = require('../dao/models/productSchema'); 

// Eliminar un producto específico del carrito
exports.deleteProductFromCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    await Cart.findByIdAndUpdate(cartId, { $pull: { products: productId } });

    res.json({ status: 'success', message: 'Producto eliminado del carrito exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
};

// Actualizar todo el carrito con un nuevo arreglo de productos
exports.updateCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const newProducts = req.body.products;

    await Cart.findByIdAndUpdate(cartId, { products: newProducts });

    res.json({ status: 'success', message: 'Carrito actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
};

// Actualizar la cantidad de ejemplares de un producto en el carrito
exports.updateProductQuantity = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;

    await Cart.findOneAndUpdate({ _id: cartId, 'products._id': productId }, { $set: { 'products.$.quantity': newQuantity } });

    res.json({ status: 'success', message: 'Cantidad de producto en el carrito actualizada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
};

// Eliminar todos los productos del carrito
exports.clearCart = async (req, res) => {
  try {
    const cartId = req.params.cid;

    await Cart.findByIdAndUpdate(cartId, { products: [] });

    res.json({ status: 'success', message: 'Todos los productos del carrito eliminados exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
};

