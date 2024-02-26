//orderSchema.js
const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Referencia al modelo de usuario
    required: true,
  },
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product', // Referencia al modelo de producto
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  // Otros campos relacionados con la orden
  status: {
    type: String,
    default: 'pendiente',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
