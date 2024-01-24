//ticketRoutes.js
const express = require('express');
const router = express.Router();

// Importa el modelo de Ticket si tienes uno
const Ticket = require('../dao/models/ticketModel');

// Endpoint para generar el ticket
router.post('/generate-ticket', async (req, res) => {
  try {
    // Aquí procesas la información de la compra y generas el ticket
    const { products, totalPrice, user, date } = req.body;

    // Puedes almacenar el ticket en la base de datos si es necesario
    const newTicket = await Ticket.create({
      products,
      totalPrice,
      user,
      date,
    });

    // Devuelve el ticket al cliente
    res.json({ success: true, ticket: newTicket });
  } catch (error) {
    console.error('Error al generar el ticket:', error);
    res.status(500).json({ success: false, error: 'Error al generar el ticket' });
  }
});

module.exports = router;
