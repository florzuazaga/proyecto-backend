// server.js
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const { app } = require('./app');
const { initializeSocket } = require('./services/socketManager');
const { Server } = require('socket.io');
const dotenv = require('dotenv');

// Carga las variables de entorno desde el archivo .env
dotenv.config();

// Accede a las variables de entorno
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const mongoURI = process.env.MONGO_URI;

const adminCredentials = {
  email: adminEmail,
  password: adminPassword,
};


// Conexión a la base de datos MongoDB (cambia la URL por la de tu base de datos)
const MONGODB_URI = process.env.mongoURI || 'mongodb+srv://florenciazuazaga36:Fabi3926@cluster0.t6cqann.mongodb.net/?retryWrites=true&w=majority';

// Conectar a MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexión a la base de datos exitosa');
  })
  .catch((error) => {
    console.error('Error de conexión a la base de datos:', error);
    process.exit(1);
  });

// Manejo de eventos de conexión y error con MongoDB
const db = mongoose.connection;
db.on('error', (error) => {
  console.error('Error de conexión a la base de datos:', error);
  process.exit(1);
});
db.once('open', () => {
  console.log('Conexión a la base de datos exitosa');
});

const server = http.createServer(app);
const io = new Server(server);

// Inicializa Socket.IO
initializeSocket(io);

// Escucha del servidor
const PORT = process.env.PORT || 8080;
const serverInstance = server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Manejo de eventos de cierre del servidor
serverInstance.on('close', async () => {
  try {
    // Realiza acciones de limpieza, como cerrar la conexión a la base de datos
    await mongoose.connection.close();
    console.log('Conexión a la base de datos cerrada correctamente');
  } catch (error) {
    console.error('Error al cerrar la conexión a la base de datos:', error);
  }
});



