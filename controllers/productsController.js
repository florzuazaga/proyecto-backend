// productsController.js
const Product = require('../dao/models/productSchema');

async function obtenerProductos(req, res) {
  try {
    const productos = await Product.find();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
}

async function agregarProducto(req, res) {
  try {
    const nuevoProducto = req.body; // Suponiendo que los datos del nuevo producto están en el cuerpo de la solicitud
    const producto = new Product(nuevoProducto);
    await producto.save();
    res.json({ status: 'success', message: 'Producto agregado exitosamente' });
  } catch (error) {
    console.error('Error al agregar producto:', error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
}

async function eliminarProducto(req, res) {
  try {
    const productId = req.params.id; // Suponiendo que el ID del producto está en los parámetros de la solicitud
    const producto = await Product.findByIdAndRemove(productId);
    
    if (producto) {
      res.json({ status: 'success', message: 'Producto eliminado exitosamente' });
    } else {
      res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
}



module.exports = {
  obtenerProductos,
  agregarProducto,
  eliminarProducto,
};


  