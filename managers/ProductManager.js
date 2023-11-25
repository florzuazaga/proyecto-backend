const fs = require('fs');
const fs = require('fs');
const Product = require('./dao/models/productschema');

class ProductManager {
    constructor(filePath) {
      this.filePath = filePath;
    }
   // Métodos para operar con la base de datos MongoDB
   static async getAllProducts() {
    try {
      const products = await Product.find({});
      return products;
    } catch (error) {
      throw new Error('Error al obtener los productos');
    }
  }

  static async getProductById(productId) {
    try {
      const product = await Product.findById(productId);
      return product;
    } catch (error) {
      throw new Error('Error al obtener el producto');
    }
  }

  static async createProduct(productData) {
    try {
      const newProduct = await Product.create(productData);
      return newProduct;
    } catch (error) {
      throw new Error('Error al crear el producto');
    }
  }
    readProductsFile() {
      try {
        const fileData = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(fileData);
      } catch (error) {
        // Maneja el error de lectura del archivo, si el archivo no existe
        return [];
      }
    }
  
    writeProductsFile(data) {
      try {
        fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
      } catch (error) {
        // Maneja el error de escritura del archivo, si no se puede escribir
        throw new Error('Error al escribir en el archivo JSON');
      }
    }
  
    getProducts(limit = null) {
      const products = this.readProductsFile();
      if (limit) {
        return products.slice(0, limit);
      }
      return products;
    }
  
    getProductById(productId) {
      const products = this.readProductsFile();
      const product = products.find((p) => p.id == productId);
      if (product) {
        return product;
      } else {
        throw new Error('Product not found');
      }
    }
  
    addProduct(newProduct) {
      const products = this.readProductsFile();
      const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
      newProduct.id = newId;
      products.push(newProduct);
      this.writeProductsFile(products);
      return newProduct;
    }
  
    updateProduct(productId, updatedFields) {
      const products = this.readProductsFile();
      const productIndex = products.findIndex((p) => p.id == productId);
      if (productIndex !== -1) {
        products[productIndex] = { ...products[productIndex], ...updatedFields };
        this.writeProductsFile(products);
        return products[productIndex];
      } else {
        throw new Error('Product not found');
      }
    }
  
    deleteProduct(productId) {
      const products = this.readProductsFile();
      const productIndex = products.findIndex((p) => p.id == productId);
      if (productIndex !== -1) {
        const deletedProduct = products.splice(productIndex, 1);
        this.writeProductsFile(products);
        return deletedProduct[0];
      } else {
        throw new Error('Product not found');
      }
    }
  }
module.exports = ProductManager;