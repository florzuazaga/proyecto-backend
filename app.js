const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const handlebars = require('express-handlebars');
const path = require('path');
const fs = require('fs');
const routes = require('./routes/routes');
const CartManager = require('./managers/CartManager');
const mongoose = require('mongoose');
const Message = require('./models/message'); // Importa el modelo Message



// Importa los modelos de Mongoose
const Product = require('./dao/models/productschema');
const Cart = require('./dao/models/cartschema');
const Message = require('./dao/models/messageschema');

// Conecta a la base de datos MongoDB
mongoose.connect('mongodb+srv://<username>:<password>@cluster.mongodb.net/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 8080;

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rutas para productos 
const productsFilePath = path.join(__dirname, 'productos.json');
// Define la ubicación del archivo carrito.json
const cartsFilePath = path.join(__dirname, 'carrito.json');

// Utiliza el enrutador definido en routes.js
app.use('/api/products', routes);

// Importa la clase ProductManager
const ProductManager = require('./managers/ProductManager');

const productManager = new ProductManager(productsFilePath);
const cartManager = new CartManager(cartsFilePath);

app.use(express.json());

app.get('/', (req, res) => {
  res.render('home', { products: productManager.getProducts() });
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { products: productManager.getProducts() });
});

// Socket.io
io.on('connection', (socket) => {
  console.log('Usuario conectado');
  socket.on('new-product', (product) => {
    // Crear un nuevo producto en la base de datos MongoDB
    Product.create(product, (err, newProduct) => {
      if (err) {
        console.error(err);
      } else {
        io.emit('update-products', newProduct);
      }
    });
  });

  socket.on('delete-product', (productId) => {
    console.log('Nuevo mensaje:', data.message);
    // Eliminar el producto de la base de datos MongoDB
    Product.findByIdAndRemove(productId, (err, deletedProduct) => {
      if (err) {
        console.error(err);
      } else {
        io.emit('update-products', deletedProduct);
      }
    });
  });
});

// Guardar el mensaje en la base de datos
const newMessage = new Message({
  user: data.user,
  message: data.message,
});
newMessage.save((err, message) => {
  if (err) {
    console.error('Error al guardar el mensaje:', err);
  } else {
    // Emitir el mensaje a todos los clientes
    io.emit('chat-message', { user: data.user, message: data.message });
  }
});

// Rutas API para productos
app.get('/api/products', (req, res) => {
  const { limit } = req.query;
  // Obtener productos de la base de datos MongoDB
  Product.find({}).limit(limit).exec((err, products) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener productos' });
    } else {
      res.json(products);
    }
  });
});

//Obtener un producto por ID:
app.get('/api/products/:pid', (req, res) => {
  const productId = req.params.pid;
  // Busca el producto en la base de datos MongoDB por su ID
  Product.findById(productId, (err, product) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener el producto' });
    } else if (!product) {
      res.status(404).json({ error: 'Producto no encontrado' });
    } else {
      res.json(product);
    }
  });
});

//Agregar un nuevo producto:
app.post('/api/products', (req, res) => {
  const newProductData = req.body;
  // Crea un nuevo producto en la base de datos MongoDB
  Product.create(newProductData, (err, newProduct) => {
    if (err) {
      res.status(400).json({ error: 'Error al crear el producto' });
    } else {
      io.emit('update-products', newProduct);
      res.status(201).json(newProduct);
    }
  });
});

//Actualizar un producto existente:
app.put('/api/products/:pid', (req, res) => {
  const productId = req.params.pid;
  const updatedProductData = req.body;
  // Actualiza el producto en la base de datos MongoDB por su ID
  Product.findByIdAndUpdate(productId, updatedProductData, { new: true }, (err, updatedProduct) => {
    if (err) {
      res.status(404).json({ error: 'Error al actualizar el producto' });
    } else {
      io.emit('update-products', updatedProduct);
      res.json(updatedProduct);
    }
  });
});

//Eliminar un producto:
app.delete('/api/products/:pid', (req, res) => {
  const productId = req.params.pid;
  // Elimina el producto de la base de datos MongoDB por su ID
  Product.findByIdAndRemove(productId, (err, deletedProduct) => {
    if (err) {
      res.status(404).json({ error: 'Error al eliminar el producto' });
    } else {
      io.emit('update-products', deletedProduct);
      res.json(deletedProduct);
    }
  });
});


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


