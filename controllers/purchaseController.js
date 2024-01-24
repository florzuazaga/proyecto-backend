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

// Realizar la compra desde el carrito
exports.purchaseFromCart = async (req, res) => {
  try {
    const cartId = req.params.cid;

    // Obtener los productos actuales en el carrito
    const cart = await Cart.findById(cartId).populate('products');

    // Verificar el stock antes de realizar la compra
    const outOfStockProducts = cart.products.filter(product => product.stock <= 0);
    if (outOfStockProducts.length > 0) {
      return res.status(400).json({ status: 'error', error: 'Algunos productos ya no están en stock' });
    }

    // Actualizar el inventario y generar un ticket
    const updatedProducts = await Promise.all(cart.products.map(async (product) => {
      // Actualizar el inventario del producto
      product.stock -= 1;
      await product.save();

      // Devolver el producto actualizado
      return product;
    }));

    // Generar un ticket con la información de la compra
    const totalPrice = updatedProducts.reduce((total, product) => total + product.price, 0);
    const ticketData = {
      products: updatedProducts.map(product => ({
        productId: product._id,
        name: product.name,
        price: product.price,
      })),
      totalPrice,
      user: req.user._id,
      date: new Date(),
    };

    const newTicket = await Ticket.create(ticketData);

    // Enviar correo electrónico al usuario después de la compra
    const userEmail = 'correo_del_usuario@example.com'; 
    await sendEmail(userEmail, 'Compra Realizada', 'Gracias por tu compra. Adjunto está tu ticket de compra.');

    // Limpiar el carrito después de la compra
    await Cart.findByIdAndUpdate(cartId, { products: [] });

    res.json({ status: 'success', message: 'Compra realizada con éxito', ticket: newTicket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
};
