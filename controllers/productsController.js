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
    const nuevoProducto = req.body;
    
    // Validar datos del nuevo producto
    if (!nuevoProducto || !nuevoProducto.nombre || !nuevoProducto.precio) {
      return res.status(400).json({ status: 'error', error: 'Datos del producto incompletos o inválidos' });
    }

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
    const productId = req.params.id;
    
    // Validar formato del ID
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ status: 'error', error: 'ID de producto inválido' });
    }

    // Cambia Product.findByIdAndRemove a Product.findByIdAndDelete
    const producto = await Product.findByIdAndDelete(productId);
    
    if (producto) {
      // Emitir el evento 'delete-product' después de confirmar la eliminación en la base de datos
      io.emit('delete-product', productId);
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



  