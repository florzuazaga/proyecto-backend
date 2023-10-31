
const express = require('express');
const ProductManager = require('./productManager');
const CartManager = require('./CartManager');

const app = express();
const port = 8080;

const productsFilePath = path.join(__dirname, 'productos.json');
const cartsFilePath = path.join(__dirname, 'carrito.json');

const productManager = new ProductManager(productsFilePath);
const cartManager = new CartManager(cartsFilePath);

app.use(express.json());

// Rutas para productos
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
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/products/:pid', (req, res) => {
  const productId = req.params.pid;
  try {
    const updatedProduct = productManager.updateProduct(productId, req.body);
    res.json(updatedProduct);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.delete('/api/products/:pid', (req, res) => {
  const productId = req.params.pid;
  try {
    const deletedProduct = productManager.deleteProduct(productId);
    res.json(deletedProduct);
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
