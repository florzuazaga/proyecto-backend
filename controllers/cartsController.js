// cartsController.js
const Cart = require('../dao/models/cartSchema'); // Asegúrate de tener la ruta correcta

exports.eliminarProductoDelCarrito = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    // Lógica para eliminar el producto del carrito
    await Cart.findByIdAndUpdate(cartId, { $pull: { products: { _id: productId } } });

    res.json({ status: 'success', message: 'Producto eliminado del carrito exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
};

exports.actualizarCarrito = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const newProducts = req.body.products;

    // Lógica para actualizar todo el carrito
    await Cart.findByIdAndUpdate(cartId, { products: newProducts });

    res.json({ status: 'success', message: 'Carrito actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
};

exports.actualizarCantidadProductoEnCarrito = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;

    // Lógica para actualizar la cantidad de ejemplares de un producto en el carrito
    await Cart.findOneAndUpdate({ _id: cartId, 'products._id': productId }, { $set: { 'products.$.quantity': newQuantity } });

    res.json({ status: 'success', message: 'Cantidad de producto en el carrito actualizada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
};
