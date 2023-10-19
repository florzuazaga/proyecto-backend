const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 8080; // Cambiar el puerto a 8080

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

  initializeId() {
    const maxId = this.products.reduce((max, producto) => (producto.id > max ? producto.id : max), 0);
    ProductManager.id = maxId + 1;
  }
    // Agregue el método getProductById para obtener un producto por su ID
    getProductById(id) {
      return this.products.find((producto) => producto.id === id);
    }

  // ... Otros métodos de la clase ProductManager

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

const productmanager = new ProductManager('productos.json');

// Ruta para consultar productos y realizar operaciones CRUD
app.route('/api/products')
  .get((req, res) => {
    const limit = req.query.limit;
    let products = productmanager.getProducts();

    if (limit) {
      products = products.slice(0, parseInt(limit));
    }

    res.json(products);
  })
  .post((req, res) => {
    const productData = req.body;
    productmanager.addProduct(productData);
    res.status(201).json({ message: 'Producto creado' });
  });

// Ruta para realizar operaciones CRUD en un producto específico
app.route('/api/products/:id')
  .get((req, res) => {
    const productId = parseInt(req.params.id);
    const product = productmanager.getProductById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  })
  .put((req, res) => {
    const productId = parseInt(req.params.id);
    const updatedFields = req.body;
    productmanager.updateProduct({ id: productId, ...updatedFields });
    res.json({ message: 'Producto actualizado' });
  })
  .delete((req, res) => {
    const productId = parseInt(req.params.id);
    productmanager.deleteProduct(productId);
    res.json({ message: 'Producto eliminado' });
  });

// Ruta personalizada '/mi-ruta'
app.get('/mi-ruta', (req, res) => {
  res.send('¡Esta es mi ruta personalizada!');
});

// Iniciar el servidor en el puerto 8080
app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
//Se testea con:
//http://localhost:8080/api/products?limit=5(cinco productos:feng shui,id1,id2,id3,id4)
//http://localhost:8080/api/products(trece productos:feng shui,id1,id2,id3,id4,id5,id6,id7,id8,id9,id10,id11,id12)
//







      
