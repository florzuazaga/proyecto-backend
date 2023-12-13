const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const MONGODB_URI = 'mongodb+srv://florenciazuazaga36:Fabi3926@cluster0.t6cqann.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Conexión a MongoDB establecida');
})
.catch((error) => {
  console.error('Error al conectar a MongoDB:', error);
});

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
  expires: 1000 * 60 * 60 * 24, // Tiempo de vida de la sesión en milisegundos 
  connectionOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
});

store.on('error', function(error) {
  console.error('Error en MongoDBStore:', error);
});

module.exports = { mongoose, store };



