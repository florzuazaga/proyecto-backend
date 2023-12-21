// app.js

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const exphbs = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const { connectToDatabase } = require('./config/databaseConfig');
const productsRoutes = require('./routes/productsRoutes'); // Rutas para productos
const authRoutes = require('./authRoutes'); // Rutas de autenticación
const adminRoutes = require('./routes/adminRoutes'); // Rutas de administrador



// Cargar variables de entorno desde .env
require('dotenv').config();

const app = express();
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Configuración de las rutas de autenticación
app.use('/', authRoutes);

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Manejador para la ruta raíz ('/')
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la página principal!');
  // se envía una respuesta con un mensaje simple.
});
// Montar las rutas
app.use('/products', productsRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});

// Conexión a la base de datos
connectToDatabase().then(() => {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
});

module.exports = app;

























