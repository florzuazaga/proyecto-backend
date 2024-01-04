//CartManager.js
class CartManager {
  async createCart(products) {
    try {
      const newCart = await Cart.create({ products });
      return newCart;
    } catch (error) {
      throw new Error(`Error al crear el carrito: ${error.message}`);
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await Cart.findById(cartId).populate('products.product');
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      return cart;
    } catch (error) {
      throw new Error(`Error al obtener el carrito por ID: ${error.message}`);
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      cart.products.push({ product: productId, quantity });
      await cart.save();

      return cart;
    } catch (error) {
      throw new Error(`Error al agregar producto al carrito: ${error.message}`);
    }
  }

  async updateProductQuantity(cartId, productId, newQuantity) {
    try {
      const cart = await Cart.findByIdAndUpdate(
        cartId,
        { $set: { 'products.$[elem].quantity': newQuantity } },
        { arrayFilters: [{ 'elem.product': productId }], new: true }
      );

      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      return cart;
    } catch (error) {
      throw new Error(`Error al actualizar la cantidad del producto en el carrito: ${error.message}`);
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await Cart.findByIdAndUpdate(
        cartId,
        { $pull: { products: { product: productId } } },
        { new: true }
      );

      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      return cart;
    } catch (error) {
      throw new Error(`Error al eliminar el producto del carrito: ${error.message}`);
    }
  }
}

module.exports = CartManager;

