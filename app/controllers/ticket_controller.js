// ticketController.js

const { obtenerInformacionParaTicket } = require('../services/ticketService');
const Ticket = require('../models/ticketSchema');
const nodemailer = require('nodemailer');

// Función para enviar correos electrónicos
const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'proyectobackend3@gmail.com',
      pass: 'lwhe uthu wzbu gpui',
    },
  });

  const mailOptions = {
    from: 'tu_correo@gmail.com',
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo electrónico enviado con éxito');
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
  }
};

// Middleware para generar un ticket
const generateTicket = async (req, res, next) => {
  try {
    // Obtener la información necesaria para el ticket desde la base de datos
    const ticketInfoFromDB = await obtenerInformacionParaTicket();
    // Verificar si totalPrice es un número válido
    if (isNaN(ticketInfoFromDB.totalPrice)) {
      throw new Error('Error al calcular el precio total para el ticket.');
    }
    // Crear el objeto de datos para el ticket
    const ticketData = {
      products: ticketInfoFromDB.products,
      totalPrice: ticketInfoFromDB.totalPrice,
      user: ticketInfoFromDB.user,
      date: new Date(), 
    };
    // Enviar correo electrónico con la información del ticket
    const userEmail = 'correo_del_usuario@gmail.com'; // Ajusta esto según tus necesidades
    const emailSubject = 'Compra realizada con éxito';
    const emailText = 'Gracias por tu compra. Aquí está la información de tu ticket: [información del ticket]';

    await sendEmail(userEmail, emailSubject, emailText);

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

// Obtener todos los tickets
async function getAllTickets(req, res) {
  try {
    const tickets = await Ticket.find();
    res.json(tickets);
  } catch (error) {
    console.error('Error al obtener tickets:', error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
}

module.exports = {
  generateTicket,
  getAllTickets,
};

