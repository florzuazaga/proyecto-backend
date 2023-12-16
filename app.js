//app.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const authRoutes = require('./routes/authRoutes');
const { mongoose, store } = require('./db/db');
const cookieParser = require('cookie-parser'); // Importa cookie-parser
const passport = require('passport');
const { initializePassport, sessionPassport } = require('./db/auth');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;


// Cargar variables de entorno desde un archivo .env
dotenv.config();

const routes = require('./routes/routes');
// Inicializar la aplicación de Express
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 8080;

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


// Middleware para manejar los errores de conexión a la base de datos
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    const error = new Error('No se pudo conectar a la base de datos');
    error.status = 500; // Establece el código de estado del error
    return next(error);
  }
  next();
});

// Agrega cookie-parser como middleware 
app.use(cookieParser());

// Rutas de autenticación
app.use('/auth', authRoutes);

// Rutas
app.get('/', (req, res) => {
  // Código para manejar la solicitud de la URL raíz '/'
  res.send('¡Hola desde la página de inicio!');
});
app.use('/api/products', routes);
app.use(authRoutes);


// Middleware para analizar el cuerpo JSON
app.use(express.json());

// Cargar datos de archivos JSON
const carritoData = JSON.parse(fs.readFileSync(path.join(__dirname, 'files', 'carrito.json'), 'utf8'));
const productosData = JSON.parse(fs.readFileSync(path.join(__dirname, 'files', 'productos.json'), 'utf8'));

// Esta función lee el archivo 'productos.json' y devuelve los productos
function obtenerProductos() {
  const productosData = JSON.parse(fs.readFileSync(path.join(__dirname, 'files', 'productos.json'), 'utf8'));
  return productosData; // Devuelve los productos obtenidos del archivo JSON
}

// Ruta para mostrar los productos
app.get('/products', (req, res) => {
  // Obtener los productos desde  archivo JSON
  const products = obtenerProductos(); // Aquí debes obtener los productos de tu lógica de negocio

  // Renderizar la vista de productos y pasar los datos
  res.render('home', { products });
});

// Ruta para mostrar el carrito de compras
app.get('/cart', (req, res) => {
  // Obtener los productos del carrito desde tu lógica de negocio
  const cartItems = obtenerProductosDelCarrito(); // Aquí debes obtener los productos del carrito

  // Renderizar la vista del carrito y pasar los datos
  res.render('cart', { items: cartItems });
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

//  Protección de ruta para la vista de productos solo para usuarios autenticados
app.get('/products', authenticate, (req, res) => {
  const { username, role } = req.session.user;
  res.render('home', { username, role });
});

// Ruta para mostrar el formulario de inicio de sesión
app.get('/login', (req, res) => {
  // Renderiza la vista del formulario de inicio de sesión
  res.render('login'); // Aquí renderiza el formulario de inicio de sesión 
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

// Proteger rutas específicas para roles particulares (para el rol de administrador)
app.get('/admin-panel', ensureLoggedIn('/login'), checkRole(roles.ADMIN), (req, res) => {
  // lógica para el panel de administrador
  res.render('admin-panel', { user: req.session.user });
});

// Protección de ruta para la vista de productos solo para usuarios autenticados
app.get('/products', ensureLoggedIn('/login'), (req, res) => {
  const { username, role } = req.session.user;
  res.render('products', { username, role });
});

// Escuchar en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor en funcionamiento en el puerto 3000');
});


// Manejo de eventos en Socket.IO
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  // Evento para recibir un nuevo producto
  socket.on('new-product', (productData) => {
    //  manejar la lógica para guardar el nuevo producto en la base de datos
    console.log('Nuevo producto recibido:', productData);

    // Emite un evento a todos los clientes para actualizar los productos
    io.emit('update-products', productData);
  });

  // Evento para eliminar un producto
  socket.on('delete-product', (productId) => {
    //  manejar la lógica para eliminar el producto de la base de datos
    console.log('Eliminar producto con ID:', productId);

    // Emite un evento a todos los clientes para actualizar los productos después de eliminar
    io.emit('product-deleted', productId);
  });

  // Evento para el chat
  socket.on('chat-message', (message) => {
    //  manejar la lógica para guardar el mensaje en la base de datos 
    console.log('Nuevo mensaje en el chat:', message);

    // Emite un evento a todos los clientes para mostrar el mensaje en el chat
    io.emit('chat-message', message);
  });

  // Manejo de desconexión
  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


