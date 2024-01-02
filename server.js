// server.js
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const { app } = require('./app');
const { initializeSocket } = require('./manager/socketManager');
const { Server } = require('socket.io');
const User = require('./dao/models/userSchema');

// Conecta a la base de datos MongoDB (cambia la URL por la de tu base de datos)
const MONGODB_URI = 'mongodb+srv://florenciazuazaga36:Fabi3926@cluster0.t6cqann.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexión a la base de datos exitosa');
  })
  .catch((error) => {
    console.error('Error de conexión a la base de datos:', error);
    process.exit(1);
  });
  
  //Agrega un Evento de Error a la Conexión
  mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

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



