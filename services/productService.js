// productService.js
// productService.js

const fs = require('fs');
const path = require('path');
const Product = require('../dao/models/productSchema');

class ProductService {
  constructor() {
    this.products = this.loadProducts();
  }

  loadProducts() {
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
    //  se obtendrá desde el array de productos cargados.
    return this.products.find(product => product.id === productId);
  }

  getAllProducts() {
    console.log('Llamada a getAllProducts');
    const limitedProducts = this.products.slice(0, 50);
    console.log('Número de productos después de limitar:', limitedProducts.length);
    return limitedProducts;
  }

  getAllProductsFromDatabase() {
    console.log('Llamada a getAllProducts desde la base de datos');
    return Product.find({}).limit(50);
  }

  getProductByIdFromDatabase(productId) {
    console.log('Llamada a getProductById desde la base de datos');
    return Product.findById(productId);
  }
}

module.exports = new ProductService();

