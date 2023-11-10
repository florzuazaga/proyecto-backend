const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const handlebars = require('express-handlebars');
const path = require('path');
const fs = require('fs');
const routes = require('./routes/routes');
const CartManager = require('./managers/CartManager');
const mongoose = require('mongoose');

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


app.get('/api/products/:pid', (req, res) => {
  const productId = req.params.pid;
  try {
    const product = productManager.getProductById(productId);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.post('/api/products', (req, res) => {
  try {
    const newProduct = productManager.addProduct(req.body);
    res.status(201).json(newProduct);
    io.emit('update-products', productManager.getProducts());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/products/:pid', (req, res) => {
  const productId = req.params.pid;
  try {
    const updatedProduct = productManager.updateProduct(productId, req.body);
    res.json(updatedProduct);
    io.emit('update-products', productManager.getProducts());
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.delete('/api/products/:pid', (req, res) => {
  const productId = req.params.pid;
  try {
    const deletedProduct = productManager.deleteProduct(productId);
    res.json(deletedProduct);
    io.emit('update-products', productManager.getProducts());
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


