// productService.js
const productFactory = require('../dao/models/productFactory');

class ProductService {
  getAllProducts() {
    return productFactory.getAllProducts();
  }

  getProductById(productId) {
    return productFactory.getProductById(productId);
  }
}

// Exporta una instancia de la clase ProductService
module.exports = new ProductService();
