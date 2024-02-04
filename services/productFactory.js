// productFactory.js

const fs = require('fs');
const path = require('path');

class ProductFactory {
  constructor() {
    this.products = this.loadProducts();
  }

  loadProducts() {
    // Cambia la ruta para reflejar la nueva ubicación del archivo
    const productosPath = path.join(__dirname, '../files/productos.json');

    try {
      const productosData = fs.readFileSync(productosPath, 'utf-8');
      const productos = JSON.parse(productosData);
      return productos;
    } catch (error) {
      console.error('Error al cargar productos:', error.message);
      return [];
    }
  }

  getProductById(productId) {
    return this.products.find(product => product.id === productId);
  }

  getAllProducts() {
    console.log('Llamada a getAllProducts');
    // Limita la respuesta a 50 productos
    const limitedProducts = this.products.slice(0, 50);
    console.log('Número de productos después de limitar:', limitedProducts.length);
    return limitedProducts;
  }
}

// Exporta una instancia de la clase ProductFactory
module.exports = new ProductFactory();

