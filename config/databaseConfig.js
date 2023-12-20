// databaseConfig.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectToDatabase = async () => {
  try {
    const connectionString = process.env.MONGODB_URI;

    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // ... otras opciones de configuración de Mongoose si es necesario
    });

    console.log('Conexión exitosa a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1); // Salir del proceso si hay un error en la conexión
  }
};

module.exports = { connectToDatabase };
