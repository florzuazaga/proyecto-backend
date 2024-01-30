// ticketService.js
const Product = require('../dao/models/productSchema');
const User = require('../dao/models/userSchema');

const obtenerInformacionParaTicket = async () => {
  try {
    // Ejemplo: Obtener productos desde la base de datos
    const products = await Product.find().limit(5); // Obtener los primeros 5 productos, ajusta según tus necesidades

    // Ejemplo: Calcular el precio total sumando los precios de los productos
    const totalPrice = products.reduce((total, product) => total + product.price, 0);

    // Ejemplo: Obtener información del usuario, puedes ajustar según tus necesidades y cómo manejas los usuarios en tu aplicación
    const user = await User.findOne({ /* condiciones de búsqueda para el usuario */ });

    return {
      products,
      totalPrice,
      user,
    };
  } catch (error) {
    console.error('Error al obtener información para el ticket:', error);
    throw error; // Puedes manejar el error según tus necesidades
  }
};

module.exports = {
  obtenerInformacionParaTicket,
};

  