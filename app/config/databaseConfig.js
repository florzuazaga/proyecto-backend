// databaseConfig.js
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
require('dotenv').config();
const path = require('path');


async function connectToDatabase() {
  try {
    // Conexión a MongoDB con Mongoose
    const mongooseConnectionString = process.env.MONGODB_URI;
    await mongoose.connect(mongooseConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexión exitosa a MongoDB con Mongoose');

    // Conexión a MongoDB con MongoClient
    const mongoClient = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await mongoClient.connect(); // Cambiado a await para esperar la conexión

    const mongoDB = mongoClient.db();
    console.log('Conexión exitosa a MongoDB con MongoClient');

    // Configuración de la sesión y el almacenamiento
    const store = new MongoDBStore({
      uri: process.env.MONGODB_URI,
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

    // Puedes exportar mongoDB, mongoose y store según tus necesidades
    return { mongoose, mongoDB, store };
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1); // Salir del proceso si hay un error en la conexión
  }
}

module.exports = connectToDatabase;








