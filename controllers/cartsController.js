// cartController.js
const fs = require('fs');
const Cart = require('../dao/models/cartSchema');
const Product = require('../dao/models/productSchema');
const Ticket = require('../dao/models/ticketModel');

// Realizar la compra desde el carrito
exports.purchaseFromCart = async (req, res) => {
  let newTicket;

  try {
    const cartId = req.params.cid;

    // Obtener los productos actuales en el carrito
    const cart = await Cart.findById(cartId).populate('products');

    // Verificar el stock antes de realizar la compra
    const outOfStockProducts = cart.products.filter(product => product.stock <= 0);
    if (outOfStockProducts.length > 0) {
      return res.status(400).json({ status: 'error', error: 'Algunos productos ya no están en stock' });
    }

    // Log para verificar los datos recibidos en la solicitud
    console.log('Contenido de req.body:', req.body);

    // Verificar si la solicitud está relacionada con la compra del carrito
    if (req.path === '/purchase/:cid') {
      // Validar los datos del cliente
      const { products, totalPrice, user, date } = req.body;

      if (!Array.isArray(products) || !totalPrice || !user || !date) {
        return res.status(400).json({ status: 'error', error: 'Datos de compra incompletos o en formato incorrecto' });
      }
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
    const ticketData = {
      products: updatedProducts.map(product => ({
        productId: product._id,
        name: product.name,
        price: product.price,
      })),
      totalPrice,
      user,
      date,
    };

    // Agregar la información de compra al archivo purchaseData.json
    const purchaseDataPath = '../files/purchaseData.json';
    let existingPurchaseData = [];

    try {
      existingPurchaseData = JSON.parse(fs.readFileSync(purchaseDataPath));
    } catch (error) {
      // Si el archivo no existe o hay un error al leerlo, continúa con un array vacío
    }

    existingPurchaseData.push(ticketData);

    // Escribe el nuevo contenido en el archivo purchaseData.json
    fs.writeFileSync(purchaseDataPath, JSON.stringify(existingPurchaseData, null, 2));

    // Limpiar el carrito después de la compra
    await Cart.findByIdAndUpdate(cartId, { products: [] });

    // Crear el nuevo ticket después de limpiar el carrito
    newTicket = await Ticket.create(ticketData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  } finally {
    if (newTicket) {
      return res.json({ status: 'success', message: 'Compra realizada con éxito', ticket: newTicket });
    }
  }
};




