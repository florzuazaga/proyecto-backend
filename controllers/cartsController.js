// cartsController.js

const http = require('http');
const Cart = require('../dao/models/cartSchema');
const Product = require('../dao/models/productSchema');
const Ticket = require('./ticket_controller');

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

// Archivo JavaScript para manejar interacciones del usuario y realizar solicitudes al servidor
// Defini un objeto purchaseData inicial vacío
let purchaseData = {
  products: [],
  totalPrice: 0,
  user: "usuario_id",
  date: new Date().toISOString().split('T')[0]
};
purchaseData.date = new Date().toISOString().split('T')[0];

// Función para agregar un producto al carrito
function addToCart(productId, quantity, price) {
  const productIndex = purchaseData.products.findIndex(product => product.productId === productId);

  if (productIndex !== -1) {
    // El producto ya está en el carrito, actualiza la cantidad
    purchaseData.products[productIndex].quantity += quantity;
  } else {
    // Agrega un nuevo producto al carrito
    purchaseData.products.push({ productId, quantity });
  }

  // Actualiza el precio total
  purchaseData.totalPrice += quantity * price;

  // Muestra la información actualizada en la consola (puedes omitir esto en la implementación real)
  console.log(purchaseData);
}

// Ejemplo de uso al agregar un producto al carrito
const productIdToAdd = 1;
const quantityToAdd = 2;
const pricePerUnit = 25.99;

addToCart(productIdToAdd, quantityToAdd, pricePerUnit);

// Luego, cuando el usuario esté listo para realizar la compra, enviarías el purchaseData actualizado al servidor.
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
// se llama cuando el usuario haga clic en un botón de "Comprar"
realizarCompra();


module.exports = cartsController;








