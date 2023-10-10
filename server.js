const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Configura la clase ProductManager (código previo)
const ProductManager = require('./productManager'); 

const productmanager = new ProductManager('productos.json'); 

// Define las rutas para consultar productos
app.get('/api/products', (req, res) => {
  const products = productmanager.getProducts();
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = productmanager.getProductById(productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

// Agrega más rutas según sea necesario (actualización, eliminación, etc.)

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
