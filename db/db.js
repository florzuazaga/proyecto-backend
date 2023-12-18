//db.js
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const { connectToDatabase, MONGODB_URI } = require('./databaseConfig');

// Conectar a la base de datos
connectToDatabase()
  .then(() => {
    const store = new MongoDBStore({
      uri: MONGODB_URI,
      collection: 'sessions',
      expires: 1000 * 60 * 60 * 24, // Tiempo de vida de la sesión en milisegundos 
      connectionOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    });

    store.on('error', function (error) {
      console.error('Error en MongoDBStore:', error);
    });

    module.exports = { mongoose, store };
  })
  .catch((error) => {
    console.error('Error al iniciar la base de datos:', error);
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

store.on('error', function (error) {
  console.error('Error en MongoDBStore:', error);
});

module.exports = { mongoose, store };




