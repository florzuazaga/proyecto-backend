const express = require('express');
const router = express.Router();

// Se importa el módulo productManager 
const productManager = require('./productManager'); 

// Ruta raíz para obtener todos los productos
router.get('/', (req, res) => {
  const limit = req.query.limit;
  let products = productManager.getProducts();

  if (limit) {
    products = products.slice(0, parseInt(limit));
  }

  res.json(products);
});

// Ruta para obtener un producto específico por ID
router.get('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid); 

  const product = productManager.getProductById(productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

// Ruta raíz para crear un nuevo producto con una solicitud POST
router.post('/', (req, res) => {
  // Obtén los datos del producto del cuerpo de la solicitud
  const productData = req.body;

  // Se genera un ID único const express = require('express');
const router = express.Router();

// Se importa el módulo productManager 
const productManager = require('./productManager'); 

// Ruta raíz para obtener todos los productos
router.get('/', (req, res) => {
  const limit = req.query.limit;
  let products = productManager.getProducts();

  if (limit) {
    products = products.slice(0, parseInt(limit));
  }

  res.json(products);
});

// Ruta para obtener un producto específico por ID
router.get('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid); // Cambia "id" a "pid" para coincidir con el parámetro de la ruta

  const product = productManager.getProductById(productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

// Ruta raíz para crear un nuevo producto con una solicitud POST
router.post('/', (req, res) => {
  // Obtén los datos del producto del cuerpo de la solicitud
  const productData = req.body;

  // Genera un ID único (puedes usar una función o biblioteca para generar IDs únicos)
  const newProductId = generateUniqueId(); // Implementa esta función

  // Verifica si el ID generado ya existe en la base de datos
  const productWithIdExists = productManager.getProducts().some((product) => product.id === newProductId);

  if (productWithIdExists) {
    // Si el ID ya existe, genera otro hasta que encuentres uno único
    do {
      newProductId = generateUniqueId();
    } while (productManager.getProducts().some((product) => product.id === newProductId));
  }

  // Agrega el nuevo producto a la base de datos
  const newProduct = {
    id: newProductId,
    title: productData.title,
    description: productData.description,
    code: productData.code,
    price: productData.price,
  };

  productManager.addProduct(newProduct);

  res.status(201).json({ message: 'Producto creado', product: newProduct });
});

module.exports = router;

  const newProductId = generateUniqueId(); 

  // Se verifica si el ID generado ya existe en la base de datos
  const productWithIdExists = productManager.getProducts().some((product) => product.id === newProductId);

  if (productWithIdExists) {
    // Si el ID ya existe, genera otro hasta que encuentres uno único
    do {
      newProductId = generateUniqueId();
    } while (productManager.getProducts().some((product) => product.id === newProductId));
  }

  // Se agrega el nuevo producto a la base de datos
  const newProduct = {
    id: newProductId,
    title: productData.title,
    description: productData.description,
    code: productData.code,
    price: productData.price,
  };

  productManager.addProduct(newProduct);

  res.status(201).json({ message: 'Producto creado', product: newProduct });
});

module.exports = router;