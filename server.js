// Ruta para obtener todos los productos desde el archivo
app.get('/products', (req, res) => {
  const products = productmanager.getProductsFromFile();
  res.json({ products });
});

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Configura la clase ProductManager 
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
  app.post('/api/products', (req, res) => {
    const productData = req.body;
    productmanager.addProduct(productData);
    res.status(201).json({ message: 'Producto creado' });
  });
  app.put('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const updatedFields = req.body;
    productmanager.updateProduct({ id: productId, ...updatedFields });
    res.json({ message: 'Producto actualizado' });
  });
  app.delete('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    productmanager.deleteProduct(productId);
    res.json({ message: 'Producto eliminado' });
  });
          

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
