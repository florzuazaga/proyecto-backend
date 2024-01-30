// ticketModel.js
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Asegúrate de que sea la misma referencia que en tu modelo de productos
      },
      name: String,
      price: Number,
    },
  ],
  totalPrice: Number,
  user: String, // Puedes ajustar el tipo según tus necesidades
  date: {
    type: Date,
    default: Date.now,
  },
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
