
const express = require('express');
const router = express.Router();
const cartManager = require('./carritoManger');
const cartManager = new CartManager();

router.post('/:cid/product/:pid', (req, res) => {
  // Obtén el ID del carrito y el ID del producto de los parámetros de la URL
  const cartId = req.params.cid;
  const productId = req.params.pid;

  // Valida que el carrito y el producto existan
  const cart = cartManager.getCartById(cartId);
  const product = productManager.getProductById(productId);

  if (!cart || !product) {
    return res.status(404).json({ message: 'Carrito o producto no encontrado' });
  }

  // Busca si el producto ya existe en el carrito
  const existingProduct = cart.products.find((cartProduct) => cartProduct.product === productId);

  if (existingProduct) {
    // Si el producto ya existe en el carrito, incrementa la cantidad
    existingProduct.quantity++;
  } else {
    // Si el producto no existe en el carrito, agrégalo con cantidad 1
    const productToAdd = {
      product: productId,
      quantity: 1,
    };
    cart.products.push(productToAdd);
  }

  res.status(201).json({ message: 'Producto agregado al carrito' });
});



// Ruta raíz para crear un nuevo carrito
router.post('/', (req, res) => {
  // Obtén los datos del carrito del cuerpo de la solicitud
  const cartData = req.body;

  // Validación de datos
  if (!cartData.products || !Array.isArray(cartData.products)) {
    return res.status(400).json({ message: 'El campo "products" es obligatorio y debe ser un arreglo.' });
  }

  // Genera un ID único para el carrito
  const newCartId = generateUniqueId(); 

  // Verifica si el ID generado ya existe
  const cartWithIdExists = cartManager.getCarts().some((cart) => cart.id === newCartId);

  if (cartWithIdExists) {
    // Si el ID ya existe, genera otro hasta que encuentres uno único
    do {
      newCartId = generateUniqueId();
    } while (cartManager.getCarts().some((cart) => cart.id === newCartId));
  }

  // Crea un nuevo carrito con los datos 
  const newCart = {
    id: newCartId,
    products: cartData.products,
  };

  cartManager.addCart(newCart);

  res.status(201).json({ message: 'Carrito creado', cart: newCart });
});

// Ruta para listar los productos de un carrito por ID
router.get('/:cid', (req, res) => {
  const cartId = req.params.cid;

  // Busca el carrito por ID
  const cart = cartManager.getCartById(cartId);

  if (!cart) {
    return res.status(404).json({ message: 'Carrito no encontrado' });
  }

  res.json(cart.products);
});

module.exports = router;
