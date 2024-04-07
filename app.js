//app.js 
// Importaciones
const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const exphbs = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const flash = require('connect-flash');
const cors = require('cors');
const compression = require('compression');
const brotli = require('brotli');
const winston = require('winston');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./app/config/swagger');
const routes = require('./app/routes/routes');
const logger = require('./app/config/logger');
const connectToDatabase = require('./app/config/databaseConfig');
const { paginateUsers } = require('./app/Repositories/userQueries');
const { initializeSocket } = require('./app/services/fileSocketApp');
const ticketController = require('./app/controllers/ticket_controller');
const productRoutes = require('./app/routes/productsRoutes');
const adminRoutes = require('./app/routes/adminRoutes');
const authRoutes = require('./app/routes/authRoutes');
const passportConfig = require('./app/controllers/adminController');
const User = require('./app/models/userSchema');
const fileDao = require('./app/services/fileSocketApp');
const cartsController = require('./app/controllers/cartsController');
const mockingModule = require('./__tests__/mockingModule');
const errorHandler = require('./app/middlewars/errorHandler');
const errorDictionary = require('./app/middlewars/errorDictionary');
const testLogger = require('./__tests__/login.test');



// Configuración de express
const app = express();
const upload = multer();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conecta a la base de datos antes de iniciar el servidor
connectToDatabase();

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

// Inicializa Passport después de configurar sesiones
app.use(passport.initialize());
app.use(passport.session());

// Configuración de connect-flash
app.use(flash());

// Utiliza la función generateTicket del controlador del ticket
app.use(ticketController.generateTicket);



// Configuración de Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'layouts')]);



// Configuración para servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT'],
}));
//Configura dotenv en la aplicación
require('dotenv').config();
// Middleware de compresión
app.use(compression());
// Middleware de compresión con soporte para Brotli
app.use(compression({
  brotli:{enabled:true, zlib:{}}
}));
// Middleware que establece el logger en el objeto req
app.use((req, res, next) => {
  req.logger = logger;
  next();
});

// Función asincrónica para buscar documentos con username: null antes de la operación de inserción
const searchAndInsert = async (req) => {
  const UserModel = User.User;
  try {
    const usersWithNullUsername = await UserModel.find({ username: null });
    if (usersWithNullUsername.length > 0) {
      req.logger.info('Documentos con username: null encontrados:', usersWithNullUsername);
      // Puedes decidir cómo manejar estos documentos si es necesario
    } else {
      req.logger.info('No se encontraron documentos con username: null. Continuando con la inserción.');

      // Aquí puedes realizar la operación de inserción sin problemas
      const newUser = await userDao.createUser('john_doe', 'Doe', 'john@example.com', 'hashedPassword', 'john_username');
      req.logger.info('Nuevo usuario creado:', newUser);
    }
  } catch (error) {
    req.logger.error('Error al buscar documentos con username: null:', error);
  }
};

// Configuración de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

  // Rutas
// Llamada a la función asincrónica dentro de una solicitud HTTP
app.get('/', (req, res) => {
  searchAndInsert(req); // Llama a la función y pasa el objeto req
  res.render('index');
});
app.get('/loggerTest', (req, res) => {
  logger.info('Este es un mensaje de información');
  logger.warn('Este es un mensaje de advertencia');
  logger.error('Este es un mensaje de error');

   // Obtén todos los registros del logger
   const allLogs = req.logger.transports.filter(t => t instanceof winston.transports.Console)
   .map(t => t.logQueue)
   .flat();

 // Envía los registros como respuesta JSON
 res.json(allLogs);
});


app.use('/auth', authRoutes);


// Rutas adicionales
app.use('/admin', adminRoutes);
app.use('/api', routes);
// Rutas de autenticación con GitHub
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
  // Manejar el éxito de la autenticación
  res.redirect('/perfil');
});
// Rutas para carritos
app.post('/api/carts', cartsController.createCart);
app.get('/api/carts/:id', cartsController.getCartById);
app.post('/purchase/:cid', async (req, res) => {
  const { user, date } = req.body; // Asegúrate de que estos datos estén disponibles en req.body
  const purchaseResult = await cartsController.purchaseFromCart(req.params.cid, user, date);

  if (purchaseResult.status === 'success') {
    res.json(purchaseResult);
  } else {
    res.status(500).json(purchaseResult);
  }
});

// Incluye las rutas de productos
app.use(productRoutes);

// Agrega logs de depuración para la ruta /api/products
app.get('/api/products', (req, res) => {
  req.logger.log('info', 'Recibida solicitud en /api/products');
  const products = getAllProducts(); 
  req.logger.log('info', 'Número de productos:', products.length);
  res.json({ products });
});
// Rutas para tickets
app.post('/api/generate-ticket', ticketController.generateTicket);
app.get('/api/tickets', ticketController.getAllTickets);

// Define la ruta para obtener las órdenes
app.get('/api/ordenes', async (req, res) => {
  try {
    // Lógica para obtener las órdenes desde la base de datos o cualquier otra fuente de datos
    const ordenes = await obtenerOrdenes(); // Debes implementar esta función

    // Devuelve las órdenes como respuesta JSON
    res.json({ ordenes });
  } catch (error) {
    req.logger.error('Error al obtener órdenes:', error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
});


// Ruta para manejar la descarga de archivos por ID
app.get('/download/:fileId', async (req, res) => {
  try {
    const fileId = req.params.fileId;

    // Usa el DAO de archivos para obtener la información del archivo por su ID
    const file = await fileDao.getFileById(fileId);

    if (file) {
      // Si el archivo existe, envíalo como respuesta
      res.download(file.path, file.originalName);
    } else {
      // Archivo no encontrado
      res.status(404).json({ error: 'Archivo no encontrado' });
    }
  } catch (error) {
    req.logger.error('Error al descargar el archivo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
// Monta el módulo de Mocking en la ruta específica
app.use('/api', mockingModule);

// Monta el manejador de errores al final de las rutas
app.use(errorHandler);
// Usa el logger en las pruebas
testLogger.debug('Mensaje de depuración para pruebas');

// Ruta para cualquier otro caso (manejo de 404)
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

// Manejo de errores
app.use((err, req, res, next) => {
  req.logger.error(`Error: ${err.message}`);
  res.status(500).send('Error interno del servidor');
});

// Conexión a la base de datos y Socket.io
const MAIN_PORT = process.env.MAIN_PORT || 8080;
const SOCKET_PORT = process.env.SOCKET_PORT || 3000;

const server = app.listen(MAIN_PORT, () => {
  console.log(`Aplicación principal escuchando en el puerto ${MAIN_PORT}`);
  initializeSocket(server);
});

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




























