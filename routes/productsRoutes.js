// productsRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../dao/models/productSchema');
const cartController = require('../controllers/cartsController');
const { validatePurchaseData } = require('../middlewars/middleware');
const { io } = require('../services/socketManager');
const { getAllProducts, addProduct, deleteProduct } = require('../controllers/productsController');
const ProductFactory = require('../services/productService');

// Rutas para productos
router.get('/api/products', getAllProducts);
router.post('/api/products', addProduct);
router.delete('/api/products/:id', deleteProduct);
// Endpoint para realizar una compra desde el carrito
router.post('/purchase/:cid', validatePurchaseData, cartController.purchaseFromCart);

// Rutas adicionales
router.get('/productos', async (req, res) => {
  try {
    // Obtener los parámetros de la consulta (query params)
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort || null;
    const query = req.query.query || null;

    // Construir el objeto de filtro según los parámetros recibidos
    const filter = {};
    if (query) {
      filter.title = { $regex: new RegExp(query, 'i') }; // Búsqueda insensible a mayúsculas y minúsculas en el título
    }

    // Construir la consulta con Mongoose
    let queryBuilder = Product.find(filter);

    // Aplicar ordenamiento si se proporciona un sort
    if (sort) {
      queryBuilder = queryBuilder.sort({ price: sort === 'asc' ? 1 : -1 });
    }

    // Obtener el total de productos sin aplicar paginación
    const totalProductos = await Product.find(filter).countDocuments();

    // Obtener los resultados de la consulta paginados y limitados según los parámetros
    const offset = (page - 1) * limit;
    const resultados = await queryBuilder.skip(offset).limit(limit);

    // Calcular la información relacionada con la paginación
    const totalPages = Math.ceil(totalProductos / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;
    const prevLink = hasPrevPage ? `/productos?page=${prevPage}&limit=${limit}` : null;
    const nextLink = hasNextPage ? `/productos?page=${nextPage}&limit=${limit}` : null;

    // Construir el objeto de respuesta
    const response = {
      status: 'success',
      payload: resultados,
      totalPages: totalPages,
      prevPage: prevPage,
      nextPage: nextPage,
      page: page,
      hasPrevPage: hasPrevPage,
      hasNextPage: hasNextPage,
      prevLink: prevLink,
      nextLink: nextLink,
    };

    // Devolver los resultados como respuesta en formato JSON
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
});

router.get('/cart', (req, res) => {
  try {
    // Lógica para obtener los productos del carrito
    const productosDelCarrito = obtenerProductosDelCarrito(); // Ajusta según tu implementación real

    // Puedes continuar con el resto de la lógica según sea necesario
    res.render('cart', { items: productosDelCarrito });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
});

router.delete('/productos/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;

    // Verificar el formato del ID antes de realizar la operación
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'ID de producto inválido' });
    }

    // Buscar y eliminar el producto por su ID
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Error al eliminar el producto: Producto no encontrado' });
    }

    // Emite el evento 'delete-product' con el ID del producto eliminado
    io.emit('delete-product', productId);

    return res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para obtener 50 productos generados
router.get('/mockingproducts', (req, res) => {
  console.log('Llamada a /mockingproducts recibida');
  const mockedProducts = ProductFactory.getAllProducts().slice(0, 50); // Limita la respuesta a 50 productos
  res.json({ products: mockedProducts });
});

module.exports = router;




