// ProductManager.js
const crudOperations = require('./crudOperations');


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
      const regex = new RegExp(keyword, 'i'); // Hace que la búsqueda sea insensible a mayúsculas y minúsculas
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

 
}

module.exports = ProductManager;

