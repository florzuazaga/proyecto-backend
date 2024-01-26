// productsRoutes.js

const express = require('express');
const router = express.Router();
const { obtenerProductos, obtenerProductosDelCarrito } = require('../controllers/productsController');
const Product = require('../dao/models/productSchema');

// Importa el objeto io para emitir eventos
const { io } = require('../services/socketManager');

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
  const cartItems = obtenerProductosDelCarrito(); // Lógica para obtener los productos del carrito
  res.render('cart', { items: cartItems });
});
// En la ruta para agregar un nuevo producto
router.post('/productos', async (req, res) => {
  try {
    const nuevoProducto = req.body;
    
    // Validar datos del nuevo producto
    if (!nuevoProducto || !nuevoProducto.title || !nuevoProducto.price) {
      return res.status(400).json({ status: 'error', error: 'Datos del producto incompletos o inválidos' });
    }

    const producto = new Product(nuevoProducto);
    await producto.save();
    
    // Emite el evento 'new-product' con los datos del nuevo producto
    io.emit('new-product', producto);

    res.json({ status: 'success', message: 'Producto agregado exitosamente' });
  } catch (error) {
    console.error('Error al agregar producto:', error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
});

// Ruta para eliminar un producto
router.delete('/productos/:pid', (req, res) => {
  try {
    const productId = req.params.pid;

    // Lógica para eliminar el producto

    // Emite el evento 'delete-product' con el ID del producto eliminado
    io.emit('delete-product', productId);

    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

module.exports = router;


