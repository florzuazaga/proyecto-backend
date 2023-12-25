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
const User = require('./dao/models/userSchema');



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

// Ruta para mostrar el formulario de inicio de sesión
app.get('/auth/login', (req, res) => {
  res.render('login'); // Renderiza el formulario de inicio de sesión usando tu motor de plantillas
});


// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para registro de usuarios
app.post('/auth/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verifica si el usuario ya existe en la base de datos
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).send('El usuario ya existe'); // Puedes personalizar el mensaje según tu necesidad
    }

    // Crea un nuevo usuario en la base de datos
    const newUser = await User.create({ username, password });

    res.redirect('/auth/login'); // Redirige a la página de inicio de sesión después del registro exitoso
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al registrar el usuario'); // Manejo básico de errores
  }
});


// Conexión a la base de datos
const PORT = process.env.PORT || 8080;

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
});

module.exports = app;

























