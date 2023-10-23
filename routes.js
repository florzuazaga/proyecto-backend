const express = require('express');
const router = express.Router();
const productManager = require('./productManager');

// Estructura de un carrito
const Cart = {
  id: '', // El ID del carrito, se autogenera
  products: [], // Un arreglo de productos en el carrito
};

// Arreglo para almacenar los carritos
const carts = [];

// Ruta raíz para crear un nuevo carrito
router.post('/', (req, res) => {
  // Obtén los datos del carrito del cuerpo de la solicitud
  const cartData = req.body;

  // Validación de datos
  if (!cartData.products || !Array.isArray(cartData.products)) {
    return res.status(400).json({ message: 'El campo "products" es obligatorio y debe ser un arreglo.' });
  }

// Genera un ID único para el carrito (implementa esta función)
const newCartId = generateUniqueId();

// Verifica si el ID generado ya existe
const cartWithIdExists = carts.some((cart) => cart.id === newCartId);

if (cartWithIdExists) {
  // Si el ID ya existe, genera otro hasta que encuentres uno único
  do {
    newCartId = generateUniqueId();
  } while (carts.some((cart) => cart.id === newCartId));
}

// Crea un nuevo carrito con los datos proporcionados
const newCart = {
  id: newCartId,
  products: cartData.products,
};

// Agrega el nuevo carrito al arreglo
carts.push(newCart);

res.status(201).json({ message: 'Carrito creado', cart: newCart });
});

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
// Ruta para obtener los productos de un carrito por su ID (cid)
router.get('/:cid', (req, res) => {
  const carritoId = req.params.cid;
  // Verifica si el carrito existe
  const carrito = carritoManager.getCarritoById(carritoId);

  if (!carrito) {
    // Si el carrito no se encuentra, devuelve un error 404
    return res.status(404).json({ message: 'Carrito no encontrado' });
  }
   // Si el carrito existe, obtén la lista de productos asociados a ese carrito
   const productosEnCarrito = carrito.productos;
     // Ahora tienes la lista de productos en el carrito
  res.json(productosEnCarrito);
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
  // Ruta raíz para eliminar un producto existente con una solicitud DELETE
router.delete('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);

  // Busca el índice del producto correspondiente en la base de datos
  const productIndex = productManager.getProducts().findIndex((product) => product.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  // Elimina el producto del arreglo en la base de datos
  productManager.getProducts().splice(productIndex, 1);

  res.json({ message: 'Producto eliminado', productId });
});


  // Actualiza los campos del producto con los valores proporcionados desde el cuerpo de la solicitud (excepto el ID)
  if ('id' in updatedFields) {
    // Elimina el campo 'id' para asegurarse de que no se actualice
    delete updatedFields.id;
  }

  Object.assign(product, updatedFields);

  res.json({ message: 'Producto actualizado', product });
});

module.exports = router;

