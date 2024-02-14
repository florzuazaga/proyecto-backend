// main.js

// Hacer la solicitud al servidor
fetch('http://localhost:8080/api/ordenes')
  .then(response => {
    // Verificar si la respuesta es exitosa (código 200)
    if (!response.ok) {
      throw new Error(`Error al obtener las órdenes: ${response.statusText}`);
    }

    // Convertir la respuesta a formato JSON
    return response.json();
  })
  .then(data => {
    // Manejar los datos obtenidos (por ejemplo, mostrar en la consola)
    console.log('Órdenes obtenidas:', data);
  })
  .catch(error => {
    // Manejar cualquier error que ocurra durante la solicitud
    console.error('Error durante la solicitud de órdenes:', error);
  });
