// productFactory.js
const fs = require('fs');
const path = require('path');

class ProductFactory {
  constructor() {
    this.products = this.loadProducts();
  }

  loadProducts() {
    const productosPath = path.join(__dirname, 'productos.json');

    try {
      const productosData = fs.readFileSync(productosPath, 'utf-8');
      const productos = JSON.parse(productosData);
      return productos;
    } catch (error) {
      console.error('Error al cargar productos:', error);
      return [];
    }
  }

  getProductById(productId) {
    return this.products.find(product => product.id === productId);
  }

  getAllProducts() {
    return this.products.slice(0, 50);
  }
}

// Exporta una instancia de la clase ProductFactory
module.exports = new ProductFactory();
