//server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const { connectToDatabase } = require('./db/databaseConfig');
const { initializePassport, sessionPassport } = require('./db/auth');
const routes = require('./routes'); // Importar tus rutas desde otro archivo

// Cargar variables de entorno desde un archivo .env
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Asignación de las rutas al servidor
app.use('/', routes); // Montar las rutas en la raíz del servidor

const PORT = process.env.PORT || 8080;

// Middleware para manejar los errores de conexión a la base de datos
const handleDatabaseConnection = async () => {
    try {
      await connectToDatabase();
    } catch (error) {
      console.error('Error connecting to the database:', error);
      process.exit(1); // Salir del proceso si no se puede conectar a la base de datos
    }
  };
// Gestión de eventos en Socket.IO
const handleSocketEvents = () => {
    io.on('connection', (socket) => {
      console.log('Usuario conectado');
  
      // Lógica para eventos de Socket.IO
      socket.on('new-product', (productData) => {
        console.log('Nuevo producto recibido:', productData);
        io.emit('update-products', productData);
      });
  
      socket.on('delete-product', (productId) => {
        console.log('Eliminar producto con ID:', productId);
        io.emit('product-deleted', productId);
      });
  
      socket.on('chat-message', (message) => {
        console.log('Nuevo mensaje en el chat:', message);
        io.emit('chat-message', message);
      });
  
      socket.on('disconnect', () => {
        console.log('Usuario desconectado');
      });
    });
  };

  handleDatabaseConnection()
  .then(() => {
    // Middleware y configuraciones de Express
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Configuración de tus vistas, si usas algún motor de plantillas como Handlebars
    app.set('view engine', 'ejs'); // Cambia 'ejs' por tu motor de plantillas
    app.set('views', path.join(__dirname, 'views')); // Directorio donde se encuentran tus vistas

    // Rutas definidas en un archivo separado
    app.use('/', routes);

    // Archivos estáticos (CSS, imágenes, etc.)
    app.use(express.static(path.join(__dirname, 'public')));

    // Iniciar el servidor
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // Llamar a la función para gestionar eventos de Socket.IO
    handleSocketEvents();
  });

// Configuración de sesión con el file store, configuración de sesión, opciones de TTL y retries 
app.use(session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: false,
    store: store, // Utiliza el almacén de sesiones configurado con MongoDB
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Tiempo de vida de la cookie de sesión en milisegundos 
    },
  }));
  
  // Definir roles antes de su uso en la función checkRole
  const roles = {
    ADMIN: 'admin',
    USUARIO: 'usuario',
  };
  // Inicialización y configuración de Passport
  initializePassport(); // Llama a la función que inicializa Passport
  app.use(sessionPassport()); // Usa la sesión configurada por Passport
  
  
  // Middleware para verificar si el usuario está autenticado
  function authenticate(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      res.status(401).json({ message: 'Acceso no autorizado' });
    }
  }
  // Middleware para verificar roles de usuario
  function checkRole(role) {
    return (req, res, next) => {
      if (req.session.user.role === role) {
        next();
      } else {
        res.status(403).json({ message: 'No tienes permiso para acceder a esta ruta' });
      }
    };
  }
  
  // Protección de ruta para la vista de productos solo para usuarios autenticados
  app.get('/products', authenticate, (req, res) => {
    const { username, role } = req.session.user;
    res.render('home', { username, role });
  });
  
  // Redirección a la página de inicio de sesión al acceder a la ruta principal ('/')
  app.get('/', (req, res) => {
    res.redirect('/login');
  });
  
  // Ruta para mostrar el formulario de inicio de sesión
  app.get('/login', (req, res) => {
    // Renderiza la vista del formulario de inicio de sesión
    res.render('login'); // Aquí renderiza el formulario de inicio de sesión 
  });
  
  // Proteger rutas específicas para roles particulares (para el rol de administrador)
  app.get('/admin-panel', authenticate, checkRole(roles.ADMIN), (req, res) => {
    // Lógica para el panel de administrador
    res.render('admin-panel', { user: req.session.user });
  });
  
  // Endpoint GET para la paginación y manejo de parámetros de consulta
app.get('/combined-api', async (req, res) => {
    const { page = 1, limit = 10, sort, query, type } = req.query;
  
    try {
      let filteredData = productosData; // Supongamos que tienes los datos de productos aquí
  
      // Aplica el filtrado por tipo de elemento si hay un parámetro de tipo
      if (type) {
        filteredData = filteredData.filter(product => product.tipo.toLowerCase() === type.toLowerCase());
      }
  
      // Aplica el filtrado si hay un parámetro de consulta
      if (query) {
        filteredData = filteredData.filter(product => product.nombre.toLowerCase().includes(query.toLowerCase()));
      }
  
      // Aplica el ordenamiento si se especifica
      if (sort === 'asc') {
        filteredData.sort((a, b) => (a.precio > b.precio) ? 1 : -1);
      } else if (sort === 'desc') {
        filteredData.sort((a, b) => (a.precio < b.precio) ? 1 : -1);
      }
  
      // Realiza la paginación de los datos
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
  
      const totalPages = Math.ceil(filteredData.length / limit);
      const hasNextPage = endIndex < filteredData.length;
      const hasPrevPage = startIndex > 0;
  
      const paginatedData = filteredData.slice(startIndex, endIndex);
  
      const result = {
        status: 'success',
        payload: paginatedData,
        totalPages,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        page: parseInt(page),
        hasPrevPage,
        hasNextPage,
      };
  
      // Realizar la solicitud a la API externa usando Axios
      const externalData = await axios.get('https://api.example.com/data');
  
      res.json({ ...result, externalData: externalData.data });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error en la solicitud combinada' });
    }
  });
  
  // Protección de ruta para la vista de productos solo para usuarios autenticados
  app.get('/products', authenticate, (req, res) => {
    const { username, role } = req.session.user;
    res.render('products', { username, role });
  });
  
  // Escuchar en el puerto 3000
  app.listen(3000, () => {
    console.log('Servidor en funcionamiento en el puerto 3000');
  });

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, io };
