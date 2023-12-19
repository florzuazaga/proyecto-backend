//routes.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const { obtenerProductosDelCarrito } = require('./controllers/productsController');
const authRoutes = require('./db/auth');

const router = express.Router();


// Middleware para analizar el cuerpo JSON
router.use(express.json());

// Cargar datos de archivos JSON
const carritoData = JSON.parse(fs.readFileSync(path.join(__dirname, 'files', 'carrito.json'), 'utf8'));
const productosData = JSON.parse(fs.readFileSync(path.join(__dirname, 'files', 'productos.json'), 'utf8'));


  
// Esta función lee el archivo 'productos.json' y devuelve los productos
function obtenerProductos() {
  const productosData = JSON.parse(fs.readFileSync(path.join(__dirname, 'files', 'productos.json'), 'utf8'));
  return productosData; // Devuelve los productos obtenidos del archivo JSON
}

// Ruta para mostrar los productos
router.get('/products', (req, res) => {
  // Obtener los productos desde  archivo JSON
  const products = obtenerProductos(); // Aquí debes obtener los productos de tu lógica de negocio

  // Renderizar la vista de productos y pasar los datos
  res.render('home', { products });
});

// Ruta para mostrar el carrito de compras
router.get('/cart', (req, res) => {
  // Obtener los productos del carrito desde tu lógica de negocio
  const cartItems = obtenerProductosDelCarrito(); // Aquí debes obtener los productos del carrito

  // Renderizar la vista del carrito y pasar los datos
  res.render('cart', { items: cartItems });
});



// Rutas
router.use(cookieParser());
router.use('/auth', require('./routes/authRoutes'));

router.get('/', (req, res) => {
  res.send('¡Hola desde la página de inicio!');
});

// Ruta para renderizar la página de inicio de sesión
router.get('/login', (req, res) => {
  res.render('login'); // Renderiza la plantilla de inicio de sesión (login.handlebars)
});

router.get('/products', (req, res) => {
  const products = obtenerProductos();
  res.render('home', { products });
});

router.get('/cart', (req, res) => {
  const cartItems = obtenerProductosDelCarrito();
  res.render('cart', { items: cartItems });
});

// Otras rutas y lógica de Express
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
// Otras rutas y lógica de Express específicas
router.get('/products', authenticate, (req, res) => {
    const { username, role } = req.session.user;
    res.render('products', { username, role });
  });
  
  router.get('/', (req, res) => {
    res.redirect('/login');
  });
  
  router.get('/login', (req, res) => {
    res.render('login');
  });
  
  const roles = {
    ADMIN: 'admin',
    USER: 'usuario',
  };
  
  router.get('/admin-panel', authenticate, checkRole(roles.ADMIN), (req, res) => {
    res.render('admin-panel', { user: req.session.user });
  });
  
  router.get('/combined-api', async (req, res) => {
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
      const axios = require('axios');
      const externalData = await axios.get('https://api.example.com/data');
  
      res.json({ ...result, externalData: externalData.data });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error en la solicitud combinada' });
    }
  });
  
  //  protección de ruta para la vista de productos solo para usuarios autenticados
  router.get('/products', authenticate, (req, res) => {
    const { username, role } = req.session.user;
    res.render('products', { username, role });
  });

module.exports = router;
