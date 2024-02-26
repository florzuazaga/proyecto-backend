// cartModel.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
  userId: { type: String, required: true },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
    },
  ],
});

// Método estático para encontrar un carrito por userId
cartSchema.statics.findOneByUserId = function (userId) {
  return this.findOne({ userId });
};

// Método estático para encontrar y limpiar los productos de un carrito por _id
cartSchema.statics.findByIdAndClearProducts = function (cartId) {
  return this.findByIdAndUpdate(cartId, { $set: { products: [] } }, { new: true });
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
