const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');
const { connectToDatabase } = require('./db/databaseConfig');
const exphbs = require('express-handlebars'); // Por ejemplo, Handlebars como motor de plantillas
const authRoutes = require('./authRoutes'); // Importar las rutas de autenticación
const routes = require('./routes'); // Otras rutas de la aplicación

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configuración del motor de plantillas (Handlebars en este caso)
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configuración de la sesión
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // Tiempo de vida de la cookie de sesión en milisegundos (1 día)
    secure: false, // Si es true, solo se enviará la cookie en conexiones HTTPS
    httpOnly: true, // La cookie solo es accesible a través del protocolo HTTP
  },
}));

// Middlewares generales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de autenticación
app.use('/auth', authRoutes);

// Otras rutas de la aplicación
app.use('/', routes);

// Manejo de eventos en Socket.IO
io.on('connection', (socket) => {
  console.log('Usuario conectado');
  // ... Lógica de eventos de Socket.IO ...
});

// Middleware para manejar los errores de conexión a la base de datos
const handleDatabaseConnection = async () => {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
};

// Iniciar conexión a la base de datos y luego el servidor
handleDatabaseConnection().then(() => {
  const PORT = process.env.PORT || 8080;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

module.exports = { app, io };

