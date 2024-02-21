const Product = require('../dao/models/productSchema');

async function getAllProducts(req, res) {
  try {
    const limit = 50; // Límite de productos
    const productos = await Product.find().limit(limit);
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
}

async function addProduct(req, res) {
  try {
    const nuevoProducto = req.body;

    // Validar datos del nuevo producto
    if (!nuevoProducto || !nuevoProducto.title || !nuevoProducto.price) {
      return res.status(400).json({ status: 'error', error: 'Datos del producto incompletos o inválidos' });
    }

    // Verificar el rol del usuario
    if (req.user.rol !== 'premium' && req.user.rol !== 'admin') {
      return res.status(403).json({ status: 'error', error: 'Acceso no autorizado para agregar productos' });
    }

    const producto = new Product({
      ...nuevoProducto,
      owner: req.user.email, // Asignar el correo del usuario como owner
    });

    await producto.save();

    res.json({ status: 'success', message: 'Producto agregado exitosamente' });
  } catch (error) {
    console.error('Error al agregar producto:', error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
}

async function updateProduct(req, res) {
  try {
    const productId = req.params.id;

    // Validar formato del ID
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ status: 'error', error: 'ID de producto inválido' });
    }

    const producto = await Product.findById(productId);

    if (!producto) {
      return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
    }

    // Verificar el rol del usuario
    if (req.user.rol === 'premium' && producto.owner !== req.user.email) {
      return res.status(403).json({ status: 'error', error: 'Acceso no autorizado para modificar este producto' });
    }

    // Aquí deberías tener la lógica para actualizar el producto

    res.json({ status: 'success', message: 'Producto actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
}

async function deleteProduct(req, res) {
  try {
    const productId = req.params.id;

    // Validar formato del ID
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ status: 'error', error: 'ID de producto inválido' });
    }

    const producto = await Product.findById(productId);

    if (!producto) {
      return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
    }

    // Verificar el rol del usuario
    if (req.user.rol === 'premium' && producto.owner !== req.user.email) {
      return res.status(403).json({ status: 'error', error: 'Acceso no autorizado para eliminar este producto' });
    }

    await Product.findByIdAndDelete(productId);

    res.json({ status: 'success', message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
}

module.exports = {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};



