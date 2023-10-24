// carritoManager.js

class CarritoManager {
    constructor() {
      this.carritos = []; // array para almacenar los carritos
      this.cartIdCounter = 1;
    }
  
     // Método para crear un nuevo carrito
  createCart() {
    const cart = {
      id: this.cartIdCounter++,
      products: [],
    };
    this.carts.push(cart);
    return cart;
  }
    // Método para obtener un carrito por su ID
    getCarritoById(carritoId) {
      return this.carritos.find((carrito) => carrito.id === carritoId);
    }
    // Método para eliminar un producto de un carrito
  removeProductFromCart(cartId, productId) {
    const cart = this.getCartById(cartId);
    if (cart) {
      cart.products = cart.products.filter((product) => product.id !== productId);
      return true;
    }
    return false;
  }
// Método para obtener el contenido de un carrito
getCartContents(cartId) {
    const cart = this.getCartById(cartId);
    return cart ? cart.products : [];
  }
  
    
  }
  
  // Exporta una instancia de la clase CarritoManager
  module.exports = new CarritoManager();
  
  