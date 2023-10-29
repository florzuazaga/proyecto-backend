
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const fs = require('fs');
const routes = require('./routes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Ruta raíz para renderizar la vista index.handlebars
app.get('/', (req, res) => {
  res.render('index');
});

// Ruta para verificar la conexión en tiempo real
app.get('/realtimeproducts', (req, res) => {
  const productosArray = cargarProductos(); // Cargar productos desde una función
  res.render('realtimeproducts', { products: productosArray });
});

// Configuración para conexiones en tiempo real
io.on('connection', (socket) => {
  console.log('Cliente conectado en /realtimeproducts');

  // lógica para interactuar con el cliente en tiempo real
  const products = productmanager.getProducts();
  socket.emit('products', products);

   // Escucha eventos del cliente y responde a ellos
   socket.on('customEvent', (data) => {
    console.log('Evento personalizado del cliente:', data);
  });
});

// Se asigna el router a las rutas base /products y /carts
app.use('/products', routes);
app.use('/carts', routes);

// Cargar datos iniciales de productos y carritos
const productosJSON = fs.readFileSync('productos.json', 'utf8');
const productosData = JSON.parse(productosJSON);
const carritoJSON = fs.readFileSync('carrito.json', 'utf8');
const carritoData = JSON.parse(carritoJSON);

const productmanager = new ProductManager('productos.json');
const carritomanger = new CarritoManger('carrito.json', productosData);

// Rutas de carritos
const cartRoutes = require('./cartRoutes');
app.use('/api/carts', cartRoutes);

// Rutas para consultar y gestionar productos
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

// Función para cargar productos desde el archivo JSON
function cargarProductos() {
  try {
    const data = fs.readFileSync('productos.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error al cargar el archivo de productos: ${error.message}`);
    return [];
  }
}

// Iniciar el servidor en el puerto 8080
server.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});









      
