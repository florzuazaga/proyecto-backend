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
const connectToDatabase = require('./services/databaseConfig');
const { paginateUsers } = require('./Repositories/userQueries');
const { initializeSocket } = require('./services/socketManager');
const ticketController = require('./controllers/ticket_controller');
const productRoutes = require('./routes/productsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const passportConfig = require('./controllers/adminController');
const User = require('./dao/models/userSchema');
const userDao = require('./dao/models/userDao');
const fileDao = require('./services/fileSocketApp');
const cartsController = require('./controllers/cartsController');



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

// Buscar documentos con username: null antes de la operación de inserción
const UserModel = User.User;
UserModel.find({ username: null })
  .then(usersWithNullUsername => {
    if (usersWithNullUsername.length > 0) {
      console.log('Documentos con username: null encontrados:', usersWithNullUsername);
      // Puedes decidir cómo manejar estos documentos si es necesario
    } else {
      console.log('No se encontraron documentos con username: null. Continuando con la inserción.');
      
      // Aquí puedes realizar la operación de inserción sin problemas
      userDao.createUser('john_doe', 'Doe', 'john@example.com', 'hashedPassword', 'john_username')
        .then(newUser => {
          console.log('Nuevo usuario creado:', newUser);
        })
        .catch(error => {
          console.error('Error al crear usuario:', error);
        });
    }
  })
  .catch(err => {
    console.error('Error al buscar documentos con username: null:', err);
  });

  app.get('/', (req, res) => {
    res.render('index');
  });
// Rutas
app.use('/auth', authRoutes);


// Rutas adicionales
app.use('/admin', adminRoutes);

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
  console.log('Recibida solicitud en /api/products');
  const products = getAllProducts(); 
  console.log('Número de productos:', products.length);
  res.json({ products });
});
// Rutas para tickets
app.post('/api/generate-ticket', ticketController.generateTicket);
app.get('/api/tickets', ticketController.getAllTickets);




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
    console.error('Error al descargar el archivo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
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




























