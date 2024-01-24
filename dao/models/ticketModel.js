// ticketModel.js
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  products: [Object],
  totalPrice: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  date: { type: Date, default: Date.now },
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
