const express = require('express');
const router = express.Router();

// Importa el módulo productManager
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
  const productId = parseInt(req.params.pid); // Se cambia "id" a "pid" para coincidir con el parámetro de la ruta

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

  // Validación de datos
  if (!productData.title || !productData.price) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  // Se genera un ID único
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
    status: true,
    stock: productData.stock || 0,
    category: productData.category || 'Sin categoría',
    thumbnails: productData.thumbnails || [],
  };

  productManager.addProduct(newProduct);

  res.status(201).json({ message: 'Producto creado', product: newProduct });
});

// Ruta raíz para actualizar un producto existente con una solicitud PUT
router.put('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const updatedFields = req.body;

  // Busca el producto correspondiente en la base de datos
  const product = productManager.getProductById(productId);

  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  // Actualiza los campos del producto con los valores proporcionados
  // desde el cuerpo de la solicitud (excepto el ID)
  if ('id' in updatedFields) {
    // Elimina el campo 'id' para asegurarse de que no se actualice
    delete updatedFields.id;
  }

  Object.assign(product, updatedFields);

  res.json({ message: 'Producto actualizado', product });
});

module.exports = router;

