// Importa la función getCartById desde el archivo donde está definida
const { getCartById } = require('./cartsController');

// Id que quiero obtener(prueba de funcionamiento)
const cartId = 123; 

// Llama a la función getCartById para obtener los datos del carrito desde la base de datos
const cartData = await getCartById(cartId);

// Verifica que obtuviste los datos del carrito correctamente
if (!cartData) {
  console.error('Error al obtener los datos del carrito desde la base de datos');
  return; 
}

// Utiliza los datos del carrito en tu solicitud fetch
fetch(`http://localhost:8080/purchase/${cartId}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(cartData), // Utiliza los datos obtenidos del carrito
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));




