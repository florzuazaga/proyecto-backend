const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Cargar variables de entorno desde un archivo .env
dotenv.config();

const routes = require('./routes/routes');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Conexión a MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Conexión a MongoDB establecida');
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
  });

// Rutas
app.use('/api/products', routes);


// Manejo de eventos en Socket.IO
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  // Evento para recibir un nuevo producto
  socket.on('new-product', (productData) => {
    // Aquí puedes manejar la lógica para guardar el nuevo producto en la base de datos
    console.log('Nuevo producto recibido:', productData);

    // Emite un evento a todos los clientes para actualizar los productos
    io.emit('update-products', productData);
  });

  // Evento para eliminar un producto
  socket.on('delete-product', (productId) => {
    // Aquí puedes manejar la lógica para eliminar el producto de la base de datos
    console.log('Eliminar producto con ID:', productId);

    // Emite un evento a todos los clientes para actualizar los productos después de eliminar
    io.emit('product-deleted', productId);
  });

  // Evento para el chat
  socket.on('chat-message', (message) => {
    // Aquí puedes manejar la lógica para guardar el mensaje en la base de datos o hacer otras operaciones
    console.log('Nuevo mensaje en el chat:', message);

    // Emite un evento a todos los clientes para mostrar el mensaje en el chat
    io.emit('chat-message', message);
  });

  // Manejo de desconexión
  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


