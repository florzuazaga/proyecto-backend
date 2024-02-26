// ticketService.js
const Product = require('../models/productSchema');

const obtenerInformacionParaTicket = async () => {
  try {
    // Obtener productos desde la base de datos
    const products = await Product.find().limit(5);

    // Verificar si no hay productos
    if (products.length === 0) {
      throw new Error('No hay productos disponibles para el ticket.');
    }

    // Calcular el precio total sumando los precios de los productos
    const totalPrice = products.reduce((total, product) => total + (product.price || 0), 0);

    // Verificar si el totalPrice es un número válido
    if (isNaN(totalPrice)) {
      throw new Error('Error al calcular el precio total para el ticket.');
    }

    return {
      products,
      totalPrice,
    };
  } catch (error) {
    console.error('Error al obtener información para el ticket:', error);
    throw error;
  }
};

module.exports = {
  obtenerInformacionParaTicket,
};


  