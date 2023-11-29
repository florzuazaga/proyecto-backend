const express = require('express');
const router = express.Router();
const Product = require('../dao/models/ProductSchema'); 

// Operaciones CRUD para productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await Product.findById(productId);
    
    if (!product) {
      res.status(404).json({ error: 'Producto no encontrado' });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

// Agregar un nuevo producto
router.post('/', async (req, res) => {
  try {
    const newProductData = req.body;
    const newProduct = await Product.create(newProductData);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el producto' });
  }
});

// Actualizar un producto existente por su ID
router.put('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedProductData = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(productId, updatedProductData, { new: true });

    if (!updatedProduct) {
      res.status(404).json({ error: 'Error al actualizar el producto' });
    } else {
      res.json(updatedProduct);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// Eliminar un producto por su ID
router.delete('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      res.status(404).json({ error: 'Error al eliminar el producto' });
    } else {
      res.json({ message: 'Producto eliminado exitosamente' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

module.exports = router;
