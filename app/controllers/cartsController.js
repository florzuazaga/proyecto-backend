// cartsController.js

const http = require('http');
const Cart = require('../models/cartSchema');
const Product = require('../models/productSchema');
const Ticket = require('./ticket_controller');
const Order = require('../models/orderSchema');
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const objectIdInstance = new ObjectId();

const cartsController = {};

// Función para crear un nuevo carrito
cartsController.createCart = async (req, res) => {
  try {
    const cartData = req.body;

    // Validación de datos
    if (!cartData || !Array.isArray(cartData.products)) {
      return res.status(400).json({ status: 'error', error: 'Datos de carrito inválidos' });
    }

    const newCart = await Cart.create(cartData);
    res.json({ status: 'success', message: 'Carrito creado con éxito', cart: newCart });
  } catch (error) {
    console.error('Error al crear el carrito:', error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
};

// Función para obtener un carrito por su ID
cartsController.getCartById = async (req, res) => {
  try {
    const cartId = req.params.id;

    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    }

    res.json({ status: 'success', cart });
  } catch (error) {
    console.error('Error al obtener el carrito por ID:', error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
};

// Realizar la compra desde el carrito
cartsController.purchaseFromCart = async (cartId, user, date) => {
  try {
    const purchaseResult = await cartsController.purchaseFromCart(cartId, user, date);

    if (purchaseResult.status === 'success') {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const request = http.request(`http://localhost:8080/purchase/${cartId}`, options, (response) => {
        let data = '';

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          console.log(JSON.parse(data));
        });
      });

      request.write(JSON.stringify(purchaseResult.ticket));
      request.end();
    } else {
      console.error('Error en la compra:', purchaseResult.error);
    }

    return purchaseResult;
  } catch (error) {
    console.error('Error en la compra y solicitud fetch:', error);
    return { status: 'error', error: 'Error interno del servidor' };
  }
};

// Función para realizar la compra desde el carrito y enviar solicitud fetch
cartsController.purchaseAndFetch = async (cartId, user, date) => {
  try {
    const purchaseResult = await cartsController.purchaseFromCart(cartId, user, date);

    if (purchaseResult.status === 'success') {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const request = http.request(`http://localhost:8080/purchase/${cartId}`, options, (response) => {
        let data = '';

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          console.log(JSON.parse(data));
        });
      });

      request.write(JSON.stringify(purchaseResult.ticket));
      request.end();
    } else {
      console.error('Error en la compra:', purchaseResult.error);
    }

    return purchaseResult;
  } catch (error) {
    console.error('Error en la compra y solicitud fetch:', error);
    return { status: 'error', error: 'Error interno del servidor' };
  }
};

// Definir un objeto purchaseData inicial vacío
let purchaseData = {
  products: [],
  totalPrice: 0,
  user: 'usuario_id',
  date: new Date().toISOString().split('T')[0],
};
purchaseData.date = new Date().toISOString().split('T')[0];

// Función para agregar un producto al carrito
function addToCart(productId, quantity, price) {
  const productIndex = purchaseData.products.findIndex((product) => product.productId.equals(productId));

  if (productIndex !== -1) {
    purchaseData.products[productIndex].quantity += quantity;
  } else {
    // Ajusta la estructura del objeto agregado al carrito
    purchaseData.products.push({
      product: new mongoose.Types.ObjectId(productId), // Utiliza 'new' para crear una instancia
      quantity: quantity,
      price: price,
    });
  }

  purchaseData.totalPrice += quantity * price;

  console.log(purchaseData);
}


// Ejemplo de uso al agregar un producto al carrito
const productIdToAdd = 1;
const quantityToAdd = 2;
const pricePerUnit = 25.99;

addToCart(productIdToAdd, quantityToAdd, pricePerUnit);

// Función para realizar la compra cuando el usuario esté listo
async function realizarCompra() {
  try {
    const response = await fetch('http://localhost:8080/api/carts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(purchaseData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Compra realizada con éxito:', result);
    } else {
      console.error('Error al realizar la compra:', response.statusText);
    }
  } catch (error) {
    console.error('Error en la solicitud fetch:', error);
  }
}

// Llamas a la función cuando el usuario esté listo para realizar la compra
// Se llama cuando el usuario haga clic en un botón de "Comprar"
realizarCompra();

module.exports = cartsController;









