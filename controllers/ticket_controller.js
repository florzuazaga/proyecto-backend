// ticketController.js

const Ticket = require('../dao/models/ticketModel');
const { obtenerInformacionParaTicket } = require('../services/ticketService');

// Middleware para generar un ticket
exports.generateTicket = async (req, res, next) => {
  try {
    // Obtener la información necesaria para el ticket desde la base de datos
    const ticketInfoFromDB = await obtenerInformacionParaTicket();

    // Crear el objeto de datos para el ticket
    const ticketData = {
      products: ticketInfoFromDB.products,
      totalPrice: ticketInfoFromDB.totalPrice,
      user: ticketInfoFromDB.user,
      date: new Date(), // Puedes ajustar esto según tus necesidades
    };

    // Guardar el ticket en la base de datos
    const newTicket = await Ticket.create(ticketData);

    // Añadir el ticket al objeto req para que esté disponible en las rutas subsiguientes
    req.generatedTicket = newTicket;

    // Continuar con la ejecución del siguiente middleware o ruta
    next();
  } catch (error) {
    console.error('Error al generar el ticket:', error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
};

module.exports = {
  generateTicket,
  // ... Otros controladores y middleware
};
