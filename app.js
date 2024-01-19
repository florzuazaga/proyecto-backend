// app.js

const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
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
const { paginateUsers } = require('./queries/userQueries');


// Conecta a la base de datos antes de iniciar el servidor
connectToDatabase();

// Configuración de dotenv
require('dotenv').config();

// Inicialización de Passport
require('./controllers/authController');
const passportConfig = require('./config/passport');

// Configuración de express
const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de express-session
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
  store: new FileStore({
    path: path.join(__dirname, '/sessions'),
  }),
}));

// Inicialización de Passport después de configurar sesiones
app.use(passport.initialize());
app.use(passport.session());

// Configuración para servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/auth', userAuthenticationRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/products', productsRoutes);

// Rutas de autenticación con Passport
app.use('/auth', userAuthenticationRoutes);

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

// Importación de login para manejar la ruta '/auth/login'
const loginController = require('./config/login');

// Ruta para mostrar el formulario de inicio de sesión
app.use('/auth/login', loginController);

app.post('/auth/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/auth/login',
  failureFlash: true  // Habilita los mensajes flash en caso de fallo de autenticación (si estás utilizando connect-flash)
}));


// Ruta para registro de usuarios
app.post('/auth/register', async (req, res) => {
  const { nombre, apellido, email, contraseña } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('El usuario ya existe');
    }

    const newUser = await User.create({ nombre, apellido,email, contraseña });

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

// Ejecutar consultas al iniciar la aplicación
(async () => {
  try {
    const result = await paginateUsers(1, 10);
    console.log('Resultados paginados:', result);
  } catch (error) {
    console.error('Error al ejecutar consultas:', error);
  }
})();

module.exports = app;



























