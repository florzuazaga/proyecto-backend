//ticketSchema.js
const Cart = require('../models/cartSchema');
const Product = require('../models/productSchema');

const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
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

// Realizar la compra desde el carrito
exports.purchaseFromCart = async (req, res) => {
  try {
    const cartId = req.params.cid;

    // Obtener el carrito actual con detalles de productos
    const cart = await Cart.findById(cartId).populate('products.product');

    // Verificar el stock antes de realizar la compra
    const outOfStockProducts = cart.products.filter(product => product.product.stock <= 0);

    if (outOfStockProducts.length > 0) {
      return res.status(400).json({ status: 'error', error: 'Algunos productos ya no están en stock' });
    }

    // Actualizar el inventario y generar un ticket
    const updatedProducts = await Promise.all(cart.products.map(async (cartProduct) => {
      const product = cartProduct.product;

      // Actualizar el inventario del producto
      product.stock -= 1;
      await product.save();

      // Devolver el producto actualizado
      return {
        productId: product._id,
        name: product.name,
        price: product.price,
      };
    }));

    // Generar un ticket con la información de la compra
    const totalPrice = updatedProducts.reduce((total, product) => total + product.price, 0);
    const { user, date } = req.body; // Asegúrate de que estos datos estén disponibles en req.body

    const ticketData = {
      products: updatedProducts,
      totalPrice,
      user,
      date,
    };

    // Guardar el ticket en la base de datos
    const newTicket = await Ticket.create(ticketData);

    // Limpiar el carrito después de la compra
    await Cart.findByIdAndUpdate(cartId, { products: [] });

    return res.json({ status: 'success', message: 'Compra realizada con éxito', ticket: newTicket });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
};
