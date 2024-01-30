const { v4: uuidv4 } = require('uuid');
const Ticket = require('../dao/models/ticketModel');

const generateTicketId = () => {
  return uuidv4();
};

exports.generateTicket = async (req, res) => {
  try {
    const purchaseData = req.body;

    if (!purchaseData || !purchaseData.products || !purchaseData.totalPrice || !purchaseData.user || !purchaseData.date) {
      return res.status(400).json({ error: 'Datos de compra incompletos' });
    }

    // Lógica para generar un ID único para el ticket
    const ticketId = generateTicketId();

    // Lógica para almacenar el ticket en la base de datos
    const ticketData = {
      ticketId,
      products: purchaseData.products,
      totalPrice: purchaseData.totalPrice,
      user: purchaseData.user,
      date: purchaseData.date,
    };

    const newTicket = await Ticket.create(ticketData);

    // Puedes enviar el ticket como respuesta
    res.json(newTicket);
  } catch (error) {
    console.error('Error al generar el ticket:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

