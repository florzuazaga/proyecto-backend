// productService.js

const Product = require('../dao/models/productSchema');

class ProductService {
  getAllProducts() {
    return Product.find({});
  }

  getProductById(productId) {
    return Product.findById(productId);
  }
}

// Exporta una instancia de la clase ProductService
module.exports = new ProductService();
