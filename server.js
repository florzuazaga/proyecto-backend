// server.js

const http = require('http');
const { Server } = require('socket.io');
const { app } = require('./app'); // Importa la aplicación Express

const server = http.createServer(app);
const io = new Server(server);

// Manejo de eventos en Socket.IO
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  // Evento: Nuevo producto
  socket.on('new-product', (productData) => {
    console.log('Nuevo producto recibido:', productData);
    // Lógica para manejar el nuevo producto
    io.emit('update-products', productData); // Emitir un evento a todos los clientes para actualizar productos
  });

  // Evento: Eliminar producto
  socket.on('delete-product', (productId) => {
    console.log('Eliminar producto con ID:', productId);
    // Lógica para eliminar el producto
    io.emit('product-deleted', productId); // Emitir un evento a todos los clientes para indicar la eliminación del producto
  });
  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});
// Manejo de errores de conexión a la base de datos y la escucha del servidor
const handleDatabaseConnection = async () => {
  try {
    // ... Lógica de conexión a la base de datos ...
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
};

handleDatabaseConnection().then(() => {
  const PORT = process.env.PORT || 8080;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

