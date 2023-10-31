const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const handlebars = require('express-handlebars');
const path = require('path');
const fs = require('fs');
const routes = require('./routes');

// Importa la clase ProductManager
const ProductManager = require('./ProductManager');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 8080;

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rutas para productos y carritos
const productsFilePath = path.join(__dirname, 'productos.json');
const cartsFilePath = path.join(__dirname, 'carrito.json');


class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  readCartsFile() {
    const fileData = fs.readFileSync(this.filePath, 'utf-8');
    return JSON.parse(fileData);
  }

  writeCartsFile(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  createCart() {
    const carts = this.readCartsFile();
    const newId = carts.length > 0 ? Math.max(...carts.map((c) => c.id)) + 1 : 1;
    const newCart = { id: newId, products: [] };
    carts.push(newCart);
    this.writeCartsFile(carts);
    return newCart;
  }

  getCartById(cartId) {
    const carts = this.readCartsFile();
    const cart = carts.find((c) => c.id == cartId);
    if (cart) {
      return cart;
    } else {
      throw new Error('Cart not found');
    }
  }

  addProductToCart(cartId, productId, quantity = 1) {
    const carts = this.readCartsFile();
    const cartIndex = carts.findIndex((c) => c.id == cartId);
    if (cartIndex !== -1) {
      const cart = carts[cartIndex];
      const existingProduct = cart.products.find((p) => p.id == productId);
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ id: productId, quantity });
      }
      this.writeCartsFile(carts);
      return cart;
    } else {
      throw new Error('Cart not found');
    }
  }
}
// Utiliza el enrutador definido en routes.js
app.use('/api/products', routes);

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
    const newProduct = productManager.addProduct(product);
    io.emit('update-products', productManager.getProducts());
  });

  socket.on('delete-product', (productId) => {
    productManager.deleteProduct(productId);
    io.emit('update-products', productManager.getProducts());
  });
});

// Rutas API para productos
app.get('/api/products', (req, res) => {
  const { limit } = req.query;
  const products = productManager.getProducts(limit);
  res.json(products);
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

// Rutas para carritos
app.post('/api/carts', (req, res) => {
  const newCart = cartManager.createCart();
  res.status(201).json(newCart);
});

app.get('/api/carts/:cid', (req, res) => {
  const cartId = req.params.cid;
  try {
    const cart = cartManager.getCartById(cartId);
    res.json(cart);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.post('/api/carts/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const { quantity } = req.body;

  try {
    const cart = cartManager.addProductToCart(cartId, productId, quantity);
    res.json(cart);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


