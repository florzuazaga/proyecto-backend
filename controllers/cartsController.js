// cartsController.js
const http = require('http');
const Cart = require('../dao/models/cartSchema');
const Product = require('../dao/models/productSchema');
const Ticket = require('../dao/models/ticketModel');

const cartsController = {};

// Función para crear un nuevo carrito
cartsController.createCart = async (req, res) => {
  try {
    // Obtén los datos del nuevo carrito desde la solicitud 
    const cartData = req.body; 

    // Crea el nuevo carrito en la base de datos
    const newCart = await Cart.create(cartData);

    res.json({ status: 'success', message: 'Carrito creado con éxito', cart: newCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
};

// Función para obtener un carrito por su ID
cartsController.getCartById = async (req, res) => {
  try {
    const cartId = req.params.id;
    
    // Lógica para obtener el carrito por su ID desde la base de datos
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    }

    res.json({ status: 'success', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
};

// Realizar la compra desde el carrito
cartsController.purchaseFromCart = async (cartId, user, date) => {
  try {
    // Obtener el carrito actual con detalles de productos
    const cart = await Cart.findById(cartId).populate('products.product');

    // Verificar el stock antes de realizar la compra
    const outOfStockProducts = cart.products.filter(product => product.product.stock <= 0);

    if (outOfStockProducts.length > 0) {
      return { status: 'error', error: 'Algunos productos ya no están en stock' };
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

    return { status: 'success', message: 'Compra realizada con éxito', ticket: newTicket };
  } catch (error) {
    console.error(error);
    return { status: 'error', error: 'Error interno del servidor' };
  }
};

// Función para realizar la compra desde el carrito y enviar solicitud fetch
cartsController.purchaseAndFetch = async (cartId, user, date) => {
  try {
    // Resto de la lógica para realizar la compra desde el carrito
    const purchaseResult = await cartsController.purchaseFromCart(cartId, user, date);

    // Verifica si la compra se realizó con éxito antes de hacer la solicitud fetch
    if (purchaseResult.status === 'success') {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Crea una instancia de la solicitud HTTP
      const request = http.request(`http://localhost:8080/purchase/${cartId}`, options, (response) => {
        let data = '';

        // Recibe los datos de la respuesta
        response.on('data', (chunk) => {
          data += chunk;
        });

        // Maneja el final de la respuesta
        response.on('end', () => {
          console.log(JSON.parse(data));
        });
      });

      // Envia los datos de la compra en el cuerpo de la solicitud
      request.write(JSON.stringify(purchaseResult.ticket));

      // Finaliza la solicitud
      request.end();
    } else {
      console.error('Error en la compra:', purchaseResult.error);
    }

    return purchaseResult; // Puedes devolver el resultado de la compra si es necesario
  } catch (error) {
    console.error('Error en la compra y solicitud fetch:', error);
    return { status: 'error', error: 'Error interno del servidor' };
  }
};

module.exports = cartsController;







