// purchaseController.js
const Cart = require('../dao/models/cartSchema');
const Product = require('../dao/models/productSchema');
const Ticket = require('../dao/models/ticketSchema');
const nodemailer = require('nodemailer');  // Agrega la importación de nodemailer

// Función para enviar correos electrónicos
const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tu_correo@gmail.com',  
      pass: 'tu_contraseña',
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


