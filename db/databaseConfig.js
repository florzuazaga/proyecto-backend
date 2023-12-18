//databaseConfig.js
require('dotenv').config(); // Asegúrate de haber cargado las variables de entorno desde tu archivo .env
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexión a MongoDB establecida');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
  }
};

module.exports = { connectToDatabase, MONGODB_URI };

