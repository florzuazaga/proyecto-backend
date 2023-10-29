
const express = require('express');
const http = require('http');
const socketIo = require('socket.io'); // Importa socket.io
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const fs = require('fs');
const routes = require('./routes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Configura socket.io para utilizar el servidor HTTP
const port = process.env.PORT || 8080; // Cambio en el puerto a 8080

app.use(bodyParser.json());

// Configura Handlebars como motor de vistas
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Ruta raíz para renderizar la vista index.handlebars
app.get('/', (req, res) => {
  res.render('index');
});

// Ruta para verificar la conexión en tiempo real
app.get('/realtimeproducts', (req, res) => {
  const productosArray = [
    {
    "title": "feng shui",
    "price": 15,
    "id": 1,
    "stock": 550
  },
  {
    "title": "product1",
    "description": "description1",
    "image": "imagen1",
    "price": 12,
    "thumbnail": "url",
    "code": "code1",
    "stock": 500,
    "id": 1
  },
  {
    "title": "product2",
    "description": "description2",
    "image": "imagen2",
    "price": 13,
    "thumbnail": "url",
    "code": "code2",
    "stock": 600,
    "id": 2
  },
  {
    "title": "Product 1",
    "description": "Description 1",
    "image": "Image 1",
    "price": 10,
    "thumbnail": "URL 1",
    "code": "Code 1",
    "stock": 100,
    "id": 3
  },
  {
    "title": "Product 2",
    "description": "Description 2",
    "image": "Image 2",
    "price": 15,
    "thumbnail": "URL 2",
    "code": "Code 2",
    "stock": 150,
    "id": 4
  },
  {
    "title": "Product 3",
    "description": "Description 3",
    "image": "Image 3",
    "price": 20,
    "thumbnail": "URL 3",
    "code": "Code 3",
    "stock": 200,
    "id": 5
  },
  {
    "title": "Product 4",
    "description": "Description 4",
    "image": "Image 4",
    "price": 25,
    "thumbnail": "URL 4",
    "code": "Code 4",
    "stock": 250,
    "id": 6
  },
  {
    "title": "Product 5",
    "description": "Description 5",
    "image": "Image 5",
    "price": 30,
    "thumbnail": "URL 5",
    "code": "Code 5",
    "stock": 300,
    "id": 7
  },
  {
    "title": "Product 6",
    "description": "Description 6",
    "image": "Image 6",
    "price": 35,
    "thumbnail": "URL 6",
    "code": "Code 6",
    "stock": 350,
    "id": 8
  },
  {
    "title": "Product 7",
    "description": "Description 7",
    "image": "Image 7",
    "price": 40,
    "thumbnail": "URL 7",
    "code": "Code 7",
    "stock": 400,
    "id": 9
  },
  {
    "title": "Product 7",
    "description": "Description 7",
    "image": "Image 7",
    "price": 45,
    "thumbnail": "URL 8",
    "code": "Code 8",
    "stock": 400,
    "id": 10
  },
  {
    "title": "Product 9",
    "description": "Description 9",
    "image": "Image 9",
    "price": 50,
    "thumbnail": "URL 9",
    "code": "Code 9",
    "stock": 500,
    "id": 11
  },
  {
    "title": "Product 10",
    "description": "Description 10",
    "image": "Image 10",
    "price": 55,
    "thumbnail": "URL 10",
    "code": "Code 10",
    "stock": 550,
    "id": 12
  }];
  
  // Renderiza la vista "realtimeproducts" y pasa los productos como datos
  res.render('realtimeproducts', { products: productosArray });
});

// Se asigna el router a las rutas base /products y /carts
app.use('/products', routes); // Rutas para productos
app.use('/carts', routes); // Rutas para carritos

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
this.products = this.loadProducts();

// Cargar datos de productos desde el archivo
const productosJSON = fs.readFileSync('productos.json', 'utf8');
const productosData = JSON.parse(productosJSON);

// Cargar datos de carrito desde el archivo
const carritoJSON = fs.readFileSync('carrito.json', 'utf8');
const carritoData = JSON.parse(carritoJSON);

const productmanager = new ProductManager('productos.json');
const carritomanger = new CarritoManger('carrito.json', productosData);

// Rutas de carritos
const cartRoutes = require('./cartRoutes');
app.use('/api/carts', cartRoutes);

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});

// Ruta para consultar productos y realizar operaciones CRUD
app.route('/api/products')
  .get((req, res) => {
    const limit = req.query.limit;
    let products = productmanager.getProducts();
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

// Configuración para conexiones en tiempo real
io.on('connection', (socket) => {
  console.log('Cliente conectado en /realtimeproducts');

  // Aquí puedes agregar lógica para interactuar con el cliente en tiempo real
  const products = productmanager.getProducts();
  socket.emit('products', products);

   //  escucha eventos del cliente y responde a ellos
   socket.on('customEvent', (data) => {
    console.log('Evento personalizado del cliente:', data);
  });
});

// Iniciar el servidor en el puerto 8080
app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});








      
