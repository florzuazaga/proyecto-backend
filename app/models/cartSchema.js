//cartSchema.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      orderStatus: {
        type: String,
        default: 'pendiente', // Puedes definir otros estados según tu lógica
        enum: ['pendiente', 'en_proceso', 'completa'], // Agrega un enum para estados válidos
      },
    },
  ],
});

module.exports = mongoose.model('Cart', cartSchema);

