const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = this.loadProducts();
    this.initializeId();
  }

  static id = 0;

  getProducts = () => {
    return this.products;
  };
  getProductsFromFile() {
    return this.loadProducts();
  }

  initializeId() {
    const maxId = this.products.reduce((max, producto) => (producto.id > max ? producto.id : max), 0);
    ProductManager.id = maxId + 1;
  }

  addProduct(product) {
    const { code } = product;

    if (this.hasProductWithCode(code)) {
      console.log(`El código ${code} ya existe`);
      return;
    }

    product.id = ProductManager.id++;
    this.products.push(product);
    this.saveProducts();
    console.log(`Producto con ID ${product.id} agregado`);
  }

  updateProduct(updateData) {
    const { id, ...updatedFields } = updateData;
    const productIndex = this.products.findIndex((producto) => producto.id === id);

    if (productIndex === -1) {
      console.log("Producto no encontrado");
      return;
    }

    const product = this.products[productIndex];
    Object.assign(product, updatedFields);

    this.saveProducts();
    console.log(`Producto con ID ${id} actualizado`);
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex((producto) => producto.id === id);

    if (productIndex === -1) {
      console.log("Producto no encontrado");
      return;
    }

    this.products.splice(productIndex, 1);
    this.saveProducts();
    console.log(`Producto con ID ${id} eliminado`);
  }

  findProductsByCode(code) {
    return this.products.filter((producto) => producto.code === code);
  }

  hasProductWithCode(code) {
    return this.products.some((producto) => producto.code === code);
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error al cargar el archivo de productos: ${error.message}`);
      return [];
    }
  }

  saveProducts() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
      console.log('Productos guardados en el archivo.');
    } catch (error) {
      console.error(`Error al guardar los productos en el archivo: ${error.message}`);
    }
  }
}
module.exports = ProductManager;

const productmanager = new ProductManager('productos.json'); 

// Agregar siete productos
productmanager.addProduct({
  title: "Product 1",
  description: "Description 1",
  image: "Image 1",
  price: 10,
  thumbnail: "URL 1",
  code: "Code 1",
  stock: 100
});

productmanager.addProduct({
  title: "Product 2",
  description: "Description 2",
  image: "Image 2",
  price: 15,
  thumbnail: "URL 2",
  code: "Code 2",
  stock: 150
});

productmanager.addProduct({
  title: "Product 3",
  description: "Description 3",
  image: "Image 3",
  price: 20,
  thumbnail: "URL 3",
  code: "Code 3",
  stock: 200
});

productmanager.addProduct({
  title: "Product 4",
  description: "Description 4",
  image: "Image 4",
  price: 25,
  thumbnail: "URL 4",
  code: "Code 4",
  stock: 250
});

productmanager.addProduct({
  title: "Product 5",
  description: "Description 5",
  image: "Image 5",
  price: 30,
  thumbnail: "URL 5",
  code: "Code 5",
  stock: 300
});

productmanager.addProduct({
  title: "Product 6",
  description: "Description 6",
  image: "Image 6",
  price: 35,
  thumbnail: "URL 6",
  code: "Code 6",
  stock: 350
});

productmanager.addProduct({
  title: "Product 7",
  description: "Description 7",
  image: "Image 7",
  price: 40,
  thumbnail: "URL 7",
  code: "Code 7",
  stock: 400
});

// Rutas para consultar productos
app.get('/api/products', (req, res) => {
  const limit = req.query.limit;
  const products = productmanager.getProducts();
  if (limit) {
    const limitedProducts = products.slice(0, parseInt(limit));
    res.json(limitedProducts);
  } else {
    res.json(products);
  }
});
// Rutas para consultar productos
app.get('/api/products', (req, res) => {
  const limit = req.query.limit;
  const products = productmanager.getProducts();
  if (limit) {
    const limitedProducts = products.slice(0, parseInt(limit));
    res.json(limitedProducts);
  } else {
    res.json(products);
  }
});

// Ruta para consultar un producto por su ID
app.get('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = productmanager.getProductById(productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

// Ruta para agregar un nuevo producto
app.post('/api/products', (req, res) => {
  const productData = req.body;
  productmanager.addProduct(productData);
  res.status(201).json({ message: 'Producto creado' });
});

// Ruta para actualizar un producto existente
app.put('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const updatedFields = req.body;
  productmanager.updateProduct({ id: productId, ...updatedFields });
  res.json({ message: 'Producto actualizado' });
});

// Ruta para eliminar un producto existente
app.delete('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  productmanager.deleteProduct(productId);
  res.json({ message: 'Producto eliminado' });
});




// Ruta personalizada '/mi-ruta'
app.get('/mi-ruta', (req, res) => {
  res.send('¡Esta es mi ruta personalizada!');
});

// Ruta para obtener todos los productos desde el archivo
app.get('/products', (req, res) => {
  const products = productmanager.getProductsFromFile();
  res.json({ products });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});





      
