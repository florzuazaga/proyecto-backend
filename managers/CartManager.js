const Cart = require('../dao/models/cartSchema'); // Importa el modelo Cart definido anteriormente

class CartManager {
  // Método para crear un nuevo carrito
  async createCart(products) {
    try {
      const newCart = await Cart.create({ products });
      return newCart;
    } catch (error) {
      throw new Error('Error al crear el carrito');
    }
  }

  // Método para obtener un carrito por su ID
  async getCartById(cartId) {
    try {
      const cart = await Cart.findById(cartId).populate('products.product');
      return cart;
    } catch (error) {
      throw new Error('Error al obtener el carrito por ID');
    }
  }

  // Método para agregar un producto al carrito
  async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      // Agrega el producto con la cantidad proporcionada al carrito
      cart.products.push({ product: productId, quantity });
      await cart.save();

      return cart;
    } catch (error) {
      throw new Error('Error al agregar producto al carrito');
    }
  }

  // Otros métodos para actualizar y eliminar productos del carrito
  async updateProductQuantity(cartId, productId, newQuantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
  
      const productIndex = cart.products.findIndex(
        (product) => product.product.toString() === productId
      );
      if (productIndex === -1) {
        throw new Error('Producto no encontrado en el carrito');
      }
  
      cart.products[productIndex].quantity = newQuantity;
      await cart.save();
  
      return cart;
    } catch (error) {
      throw new Error('Error al actualizar la cantidad del producto en el carrito');
    }
  }
  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
  
      cart.products = cart.products.filter(
        (product) => product.product.toString() !== productId
      );
      await cart.save();
  
      return cart;
    } catch (error) {
      throw new Error('Error al eliminar el producto del carrito');
    }
  }
  
}

module.exports = CartManager;
