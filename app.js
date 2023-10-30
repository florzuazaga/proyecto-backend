const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 8080;

// Configuración de Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.get('/', (req, res) => {
  // Renderizar la vista 'home.handlebars' con la lista de productos
  res.render('home', { products: getAllProducts() });
});

app.get('/realtimeproducts', (req, res) => {
  // Renderizar la vista 'realTimeProducts.handlebars' con la lista de productos en tiempo real
  res.render('realTimeProducts', { products: getAllProducts() });
});

// Socket.io
io.on('connection', (socket) => {
  socket.on('new-product', (product) => {
    // Lógica para agregar un nuevo producto a la lista de productos y emitirlo a la vista en tiempo real
    products.push(product);
    io.emit('update-products', getAllProducts());
  });

  socket.on('delete-product', (productId) => {
    // Lógica para eliminar un producto de la lista y emitir la actualización a la vista en tiempo real
    products = products.filter(p => p.id !== productId);
    io.emit('update-products', getAllProducts());
  });
});

// Función para obtener la lista de productos (debe ser adaptada a tu implementación)
function getAllProducts() {
  // Lógica para obtener la lista de productos desde donde los tengas almacenados (pueden ser archivos, base de datos, etc.)
  // Debes adaptar esta función a tu estructura de datos
  return [];
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


