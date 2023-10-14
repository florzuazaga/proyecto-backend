const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

// Ruta para obtener todos los productos desde el archivo
app.get('/products', (req, res) => {
  const products = productmanager.getProductsFromFile();
  res.json({ products });
});



// Configura la clase ProductManager 
const ProductManager = require('./productManager'); 

const productmanager = new ProductManager('productos.json'); 

// Agregar ocho productos
productmanager.addProduct({
  title: "Product 1",
  description: "Description 1",
  image: "Image 1",
  price: 10,
  thumbnail: "URL 1",
  code: "Code 1",
  stock: 100
});

productmanager.addProduct({
  title: "Product 2",
  description: "Description 2",
  image: "Image 2",
  price: 15,
  thumbnail: "URL 2",
  code: "Code 2",
  stock: 150
});

productmanager.addProduct({
  title: "Product 3",
  description: "Description 3",
  image: "Image 3",
  price: 20,
  thumbnail: "URL 3",
  code: "Code 3",
  stock: 200
});

productmanager.addProduct({
  title: "Product 4",
  description: "Description 4",
  image: "Image 4",
  price: 25,
  thumbnail: "URL 4",
  code: "Code 4",
  stock: 250
});

productmanager.addProduct({
  title: "Product 5",
  description: "Description 5",
  image: "Image 5",
  price: 30,
  thumbnail: "URL 5",
  code: "Code 5",
  stock: 300
});

productmanager.addProduct({
  title: "Product 6",
  description: "Description 6",
  image: "Image 6",
  price: 35,
  thumbnail: "URL 6",
  code: "Code 6",
  stock: 350
});

productmanager.addProduct({
  title: "Product 7",
  description: "Description 7",
  image: "Image 7",
  price: 45,
  thumbnail: "URL 8",
  code: "Code 8",
  stock: 400
});
productmanager.addProduct({
  title: "Product 8",
  description: "Description 8",
  image: "Image 8",
  price: 40,
  thumbnail: "URL 7",
  code: "Code 7",
  stock: 450
});

// Rutas para consultar productos
app.get('/api/products', (req, res) => {
  const limit = req.query.limit;
  const products = productmanager.getProducts();
  if (limit) {
    const limitedProducts = products.slice(0, parseInt(limit));
    res.json(limitedProducts);
  } else {
    res.json(products);
  }
});

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
