const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');

// Cargar variables de entorno desde un archivo .env
dotenv.config();

const routes = require('./routes/routes');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Conexión a MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Conexión a MongoDB establecida');
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
  });

// Rutas
app.use('/api/products', routes);

// Middleware para analizar el cuerpo JSON
app.use(express.json());

// Cargar datos de archivos JSON
const carritoData = JSON.parse(fs.readFileSync(path.join(__dirname, 'files', 'carrito.json'), 'utf8'));
const productosData = JSON.parse(fs.readFileSync(path.join(__dirname, 'files', 'productos.json'), 'utf8'));

// Ruta para mostrar los productos
app.get('/products', (req, res) => {
  // Obtener los productos desde  archivo JSON
  const products = obtenerProductos(); // Aquí debes obtener los productos de tu lógica de negocio

  // Renderizar la vista de productos y pasar los datos
  res.render('products', { products });
});

// Ruta para mostrar el carrito de compras
app.get('/cart', (req, res) => {
  // Obtener los productos del carrito desde tu lógica de negocio
  const cartItems = obtenerProductosDelCarrito(); // Aquí debes obtener los productos del carrito

  // Renderizar la vista del carrito y pasar los datos
  res.render('cart', { items: cartItems });
});

// Endpoint GET para la paginación y manejo de parámetros de consulta
app.get('/api/store/products', (req, res) => {
  const { page = 1, limit = 10, sort, query, type } = req.query;

  let filteredData = productosData;

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

  const prevLink = hasPrevPage ? `/api/store/products?page=${page - 1}&limit=${limit}&sort=${sort}&query=${query}&type=${type || ''}` : null;
  const nextLink = hasNextPage ? `/api/store/products?page=${page + 1}&limit=${limit}&sort=${sort}&query=${query}&type=${type || ''}` : null;

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
    prevLink,
    nextLink,
  };

  res.json(result);
});

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

//  Protección de ruta para la vista de productos solo para usuarios autenticados
app.get('/products', authenticate, (req, res) => {
  const { username, role } = req.session.user;
  res.render('products', { username, role });
});

// Usar las rutas de autenticación
app.use('/auth', authRoutes);

// Configuración de sesión
app.use(session({
  secret: 'secreto', // Clave para firmar la cookie de sesión
  resave: false,
  saveUninitialized: true
}));

const roles = {
  ADMIN: 'admin',
  USUARIO: 'usuario',
};

// Proteger rutas específicas para roles particulares (para el rol de administrador)
app.get('/admin-panel', authenticate, checkRole(roles.ADMIN), (req, res) => {
  // lógica para el panel de administrador
  res.render('admin-panel', { user: req.session.user });
});

app.listen(3000, () => {
  console.log('Servidor en funcionamiento en el puerto 3000');
});

// Manejo de eventos en Socket.IO
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  // Evento para recibir un nuevo producto
  socket.on('new-product', (productData) => {
    // Aquí puedes manejar la lógica para guardar el nuevo producto en la base de datos
    console.log('Nuevo producto recibido:', productData);

    // Emite un evento a todos los clientes para actualizar los productos
    io.emit('update-products', productData);
  });

  // Evento para eliminar un producto
  socket.on('delete-product', (productId) => {
    // Aquí puedes manejar la lógica para eliminar el producto de la base de datos
    console.log('Eliminar producto con ID:', productId);

    // Emite un evento a todos los clientes para actualizar los productos después de eliminar
    io.emit('product-deleted', productId);
  });

  // Evento para el chat
  socket.on('chat-message', (message) => {
    // Aquí puedes manejar la lógica para guardar el mensaje en la base de datos o hacer otras operaciones
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


