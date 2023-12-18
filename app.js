// app.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const { connectToDatabase } = require('./db/databaseConfig');
const { initializePassport, sessionPassport } = require('./db/auth');
const routes = require('./routes');
const { obtenerProductos } = require('./dataUtils'); // Importa la función desde el archivo dataUtils.js
const exphbs = require('express-handlebars');



dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configuración de Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Configuración del middleware de sesión
app.use(session({
  secret: 'your-secret-key', // Cambia por una clave secreta más segura
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // Tiempo de vida de la cookie de sesión en milisegundos (1 día)
    secure: false, // Si es true, solo se enviará la cookie en conexiones HTTPS
    httpOnly: true, // La cookie solo es accesible a través del protocolo HTTP
  },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas definidas en un archivo separado
app.use('/', routes);

// Inicialización y configuración de Passport
initializePassport();
app.use(sessionPassport());


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

  // Evento: Mensaje en el chat
  socket.on('chat-message', (message) => {
    console.log('Nuevo mensaje en el chat:', message);
    // Lógica para el mensaje en el chat
    io.emit('chat-message', message); // Emitir el mensaje a todos los clientes
  });

  // Evento: Desconexión del usuario
  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Manejo de errores de conexión a la base de datos
const handleDatabaseConnection = async () => {
  try {
    await connectToDatabase();
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

module.exports = { app, io };





















//cookie
app.get('/', (req, res) => {
  // Acceder a una cookie llamada 'miCookie'
  const miCookie = req.cookies.miCookie;
  res.send(`Valor de miCookie: ${miCookie}`);
});
app.get('/setcookie', (req, res) => {
  // Establecer una cookie llamada 'miCookie' con el valor 'Hola, cookie!'
  res.cookie('miCookie', 'Hola, cookie!');
  res.send('Cookie establecida correctamente');
});









