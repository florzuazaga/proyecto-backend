// ProductManager.js
const fs = require('fs');
const path = require('path');
const Product = require('../dao/models/productSchema');
const modelOperations = require('../dao/models/modelOperations');

class ProductManager {

  async getProductsByCategory(category) {
    try {
      const products = await Product.find({ category });
      return products;
    } catch (error) {
      throw new Error(`Error al obtener productos por categoría: ${error.message}`);
    }
  }

  async searchProducts(keyword) {
    try {
      const regex = new RegExp(keyword, 'i');
      const products = await Product.find({ $or: [{ name: regex }, { description: regex }] });
      return products;
    } catch (error) {
      throw new Error(`Error al buscar productos: ${error.message}`);
    }
  }

  async getProductsWithDiscount() {
    try {
      const products = await Product.find({ discount: { $gt: 0 } });
      return products;
    } catch (error) {
      throw new Error(`Error al obtener productos con descuento: ${error.message}`);
    }
  }

  async updateProductStock(productId, newStock) {
    try {
      const product = await Product.findByIdAndUpdate(productId, { $set: { stock: newStock } }, { new: true });
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      return product;
    } catch (error) {
      throw new Error(`Error al actualizar el stock del producto: ${error.message}`);
    }
  }

  async getPopularProducts(limit) {
    try {
      const products = await Product.find({}).sort({ popularity: -1 }).limit(limit);
      return products;
    } catch (error) {
      throw new Error(`Error al obtener los productos más populares: ${error.message}`);
    }
  }


  // Métodos relacionados con la carga de productos desde un archivo (si aún es necesario)
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

  async getProductById(productId) {
    // Obtendrá desde la base de datos si está definido, de lo contrario, se obtendrá desde el array de productos cargados.
    const productFromDatabase = await modelOperations.getById(Product, productId);
    return productFromDatabase || this.products.find(product => product.id === productId);
}


  getAllProducts() {
    console.log('Llamada a getAllProducts');
    const limitedProducts = this.products.slice(0, 50);
    console.log('Número de productos después de limitar:', limitedProducts.length);
    return limitedProducts;
  }

  getAllProductsFromDatabase() {
    console.log('Llamada a getAllProducts desde la base de datos');
    return modelOperations.getAll(Product).limit(50);
  }

  getProductByIdFromDatabase(productId) {
    console.log('Llamada a getProductById desde la base de datos');
    return modelOperations.getById(Product, productId);
  }
}

module.exports = new ProductManager();


