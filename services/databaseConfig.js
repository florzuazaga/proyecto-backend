// databaseConfig.js
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const connectToDatabase = async () => {
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

    mongoClient.connect((err) => {
      if (err) {
        console.error('Error en la conexión a MongoDB con MongoClient:', err);
        return;
      }

      const mongoDB = mongoClient.db();
      console.log('Conexión exitosa a MongoDB con MongoClient');

      // Puedes exportar mongoDB o cualquier otro objeto según tus necesidades
      module.exports = { mongoose, mongoDB };
    });
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1); // Salir del proceso si hay un error en la conexión
  }
};

module.exports = { connectToDatabase };



