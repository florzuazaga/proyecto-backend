// productService.js

const Product = require('../dao/models/productSchema');

class ProductService {
  getAllProducts() {
    console.log('Llamada a getAllProducts');
    // Limita la respuesta a 50 productos
    return Product.find({}).limit(50);
  }

  getProductById(productId) {
    return Product.findById(productId);
  }
}

// Exporta una instancia de la clase ProductService
module.exports = new ProductService();
