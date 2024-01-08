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
const passportConfig = require('./config/passport');

// Incluye la configuración y estrategia de GitHub
require('./controllers/authController');

require('dotenv').config();

const app = express();

// Conexión a la base de datos
connectToDatabase();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session());

// Rutas de autenticación con Passport
app.use('/auth', userAuthenticationRoutes);

// Configuración de sesiones
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
  })
);

// Configuración para servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rutas de autenticación con GitHub
app.get('/auth/github', passport.authenticate('github'));

app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    // Manejar el éxito de la autenticación
    res.redirect('/perfil');
  }
);

// Montar las rutas
app.use('/products', productsRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', userAuthenticationRoutes);

// Importación de login para manejar la ruta '/auth/login'
const loginController = require('./config/login');

// Ruta para mostrar el formulario de inicio de sesión
app.use('/auth/login', loginController);


// Ruta para registro de usuarios
app.post('/auth/register', async (req, res) => {
  const { nombre, apellido, correo_electronico, contraseña } = req.body;

  try {
    const existingUser = await User.findOne({ correo_electronico });
    if (existingUser) {
      return res.status(400).send('El usuario ya existe');
    }

    const newUser = await User.create({ nombre, apellido, correo_electronico, contraseña });

    res.redirect('/auth/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al registrar el usuario');
  }
});

// Ruta para la URL raíz (página de inicio)
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la página de inicio!');
});

// Ruta para cualquier otro caso (manejo de 404)
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error interno del servidor');
});

// Conexión a la base de datos
const MAIN_PORT = process.env.MAIN_PORT || 8080;
const SOCKET_PORT = process.env.SOCKET_PORT || 3000;

const server = app.listen(MAIN_PORT, () => {
  console.log(`Aplicación principal escuchando en el puerto ${MAIN_PORT}`);
});

// Inicializar Socket.io
const { initializeSocket } = require('./managers/socketManager');
initializeSocket(server);

module.exports = app;


























