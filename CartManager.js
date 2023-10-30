const fs = require('fs');
const path = require('path');

class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  readCartsFile() {
    const fileData = fs.readFileSync(this.filePath, 'utf-8');
    return JSON.parse(fileData);
  }

  writeCartsFile(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  createCart() {
    const carts = this.readCartsFile();
    const newId = carts.length > 0 ? Math.max(...carts.map((c) => c.id)) + 1 : 1;
    const newCart = { id: newId, products: [] };
    carts.push(newCart);
    this.writeCartsFile(carts);
    return newCart;
  }

  getCartById(cartId) {
    const carts = this.readCartsFile();
    const cart = carts.find((c) => c.id == cartId);
    if (cart) {
      return cart;
    } else {
      throw new Error('Cart not found');
    }
  }

  addProductToCart(cartId, productId, quantity = 1) {
    const carts = this.readCartsFile();
    const cartIndex = carts.findIndex((c) => c.id == cartId);
    if (cartIndex !== -1) {
      const cart = carts[cartIndex];
      const existingProduct = cart.products.find((p) => p.id == productId);
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ id: productId, quantity });
      }
      this.writeCartsFile(carts);
      return cart;
    } else {
      throw new Error('Cart not found');
    }
  }
}

module.exports = CartManager;

  
  