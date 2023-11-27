const express = require('express');
const http = require('http');
const { Server } = require('socket.io'); // Importa Server desde socket.io
const handlebars = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose'); // Importa Mongoose

// Importa los modelos de Mongoose
const Product = require('./dao/models/productSchema'); // Importa el modelo de productos
const Cart = require('./dao/models/cartschema'); // Importa el modelo de carritos
const Message = require('./dao/models/messageschema'); // Importa el modelo de mensajes

const routes = require('./routes/routes');
const CartManager = require('./managers/CartManager');
const ProductManager = require('./managers/ProductManager');
const app = express();
const server = http.createServer(app);
const io = new Server(server); // Usa Server desde socket.io

const PORT = process.env.PORT || 8080;

// Configura la conexión a MongoDB y Conecta a la base de datos MongoDB
mongoose.connect('mongodb+srv://florenciazuazaga36:<Florencia3870>@cluster0.t6cqann.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


// Rutas para productos 
const productsFilePath = path.join(__dirname, 'productos.json');
// Define la ubicación del archivo carrito.json
const cartsFilePath = path.join(__dirname, 'carrito.json');

// Utiliza el enrutador definido en routes.js
app.use('/api/products', routes);

const productManager = new ProductManager(productsFilePath);
const cartManager = new CartManager(cartsFilePath);



app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const products = await ProductManager.getAllProducts();
    res.render('home', { products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Socket.io
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  socket.on('new-product', (product) => {
    // Crear un nuevo producto en la base de datos MongoDB
    Product.create(product, (err, newProduct) => {
      if (err) {
        console.error(err);
      } else {
        io.emit('update-products', newProduct);
      }
    });
  });

  socket.on('delete-product', (productId) => {
    // Eliminar el producto de la base de datos MongoDB
    Product.findByIdAndRemove(productId, (err, deletedProduct) => {
      if (err) {
        console.error(err);
      } else {
        io.emit('update-products', deletedProduct);
      }
    });
  });

  // Guardar el mensaje en la base de datos
  socket.on('chat-message', (data) => {
    const newMessage = new Message({
      user: data.user,
      message: data.message,
    });
    newMessage.save((err, message) => {
      if (err) {
        console.error('Error al guardar el mensaje:', err);
      } else {
        // Emitir el mensaje a todos los clientes
        io.emit('chat-message', { user: data.user, message: data.message });
      }
    });
  });
  // Manejar desconexiones de usuarios
socket.on('disconnect', () => {
  console.log('Usuario desconectado');
});
});

// Rutas API para productos
app.get('/api/products', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (query) {
      // Aplicar filtro por categoría o disponibilidad si se proporciona el parámetro query
      filter = {
        $or: [
          { category: { $regex: query, $options: 'i' } }, // Búsqueda por categoría (insensible a mayúsculas/minúsculas)
          { availability: { $regex: query, $options: 'i' } }, // Búsqueda por disponibilidad
        ],
      };
    }

    const sortOptions = {};
    if (sort === 'asc' || sort === 'desc') {
      sortOptions.price = sort === 'asc' ? 1 : -1;
    }

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const result = {
      status: 'success',
      payload: products,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page: Number(page),
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}` : null,
      nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}` : null,
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Obtener un producto por ID:
app.get('/api/products/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    // Busca el producto en la base de datos MongoDB por su ID
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


// Agregar un nuevo producto:
app.post('/api/products', (req, res) => {
  const newProductData = req.body;
  // Crea un nuevo producto en la base de datos MongoDB
  Product.create(newProductData)
    .then(newProduct => {
      io.emit('update-products', newProduct);
      res.status(201).json(newProduct);
    })
    .catch(error => {
      res.status(400).json({ error: 'Error al crear el producto' });
    });
});

// Actualizar un producto existente:
app.put('/api/products/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedProductData = req.body;

    // Actualiza el producto en la base de datos MongoDB por su ID
    const updatedProduct = await Product.findByIdAndUpdate(productId, updatedProductData, { new: true });

    if (!updatedProduct) {
      res.status(404).json({ error: 'Error al actualizar el producto' });
    } else {
      io.emit('update-products', updatedProduct);
      res.json(updatedProduct);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});


// Eliminar un producto:
app.delete('/api/products/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;

    // Elimina el producto de la base de datos MongoDB por su ID
    const deletedProduct = await Product.deleteOne({ _id: productId });

    if (deletedProduct.deletedCount === 0) {
      res.status(404).json({ error: 'Error al eliminar el producto' });
    } else {
      io.emit('update-products', productId);
      res.json({ message: 'Producto eliminado exitosamente' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


