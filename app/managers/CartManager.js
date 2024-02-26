// cartManager.js
const Cart = require('../models/cartModel');


class CartManager {
  

  async getCartByUserId(userId) {
    try {
      const cart = await Cart.findOne({ userId });
      return cart;
    } catch (error) {
      throw new Error(`Error al obtener el carrito por usuario: ${error.message}`);
    }
  }

  async calculateCartTotal(cartId) {
    try {
      const cart = await Cart.findById(cartId).populate('products.product');
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      let total = 0;
      cart.products.forEach((item) => {
        total += item.product.price * item.quantity;
      });

      return total;
    } catch (error) {
      throw new Error(`Error al calcular el total del carrito: ${error.message}`);
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await Cart.findByIdAndUpdate(cartId, { $set: { products: [] } }, { new: true });
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      return cart;
    } catch (error) {
      throw new Error(`Error al limpiar el carrito: ${error.message}`);
    }
  }

  
}

module.exports = CartManager;


