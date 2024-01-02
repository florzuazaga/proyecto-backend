// app.js

// app.js
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const exphbs = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const { connectToDatabase } = require('./config/databaseConfig');
const productsRoutes = require('./routes/productsRoutes');
const userAuthenticationRoutes = require('./userAuthenticationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const User = require('./dao/models/userSchema');
const authRoutes = require('./routes/authRoutes');

require('dotenv').config();

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de sesiones
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
  })
);

// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuración para servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Montar las rutas
app.use('/products', productsRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', userAuthenticationRoutes);

// Ruta para mostrar el formulario de inicio de sesión
app.get('/auth/login', (req, res) => {
  res.render('login');
});

// Ruta para registro de usuarios
app.post('/auth/register', async (req, res) => {
  const { nombre, apellido, correo_electronico, contraseña } = req.body;

  try {
    const existingUser = await User.findOne({ correo_electronico });
    if (existingUser) {
      return res.status(400).send('El usuario ya existe');
    }

    const newUser = await User.create({
      first_name: nombre,
      last_name: apellido,
      email: correo_electronico,
      password: contraseña,
    });

    res.redirect('/auth/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al registrar el usuario');
  }
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error interno del servidor');
});

// Conexión a la base de datos
const PORT = process.env.PORT || 8080;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error de conexión a la base de datos:', error);
    process.exit(1);
  });

module.exports = app;


























