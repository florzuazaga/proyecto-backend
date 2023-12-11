const { MongoClient } = require('mongodb');

const mongoURI = 'mongodb+srv://florenciazuazaga36:Fabi3926@cluster0.t6cqann.mongodb.net/?retryWrites=true&w=majority';

const store = new MongoDBStore({
  uri: mongoURI,
  collection: 'sessions',
  expires: 1000 * 60 * 60 * 24,
  connectionOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
});

const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect(err => {
  if (err) {
    console.error('Error en la conexión a MongoDB:', err);
    return;
  }

  const db = client.db();

  store.client = client;
  store.db = db;
});

// Exportar el objeto store y el cliente para usarlos en otras partes de la aplicación
module.exports = { store, client };
