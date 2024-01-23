//db.js
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const { connectToDatabase, MONGODB_URI } = require('./databaseConfig');

const initializeDB = async () => {
  try {
    await connectToDatabase();

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

    return { mongoose, store };
  } catch (error) {
    console.error('Error al iniciar la base de datos:', error);
    throw new Error('Error al iniciar la base de datos');
  }
};

module.exports = { initializeDB };




