// fileSocketApp.js
const { Server } = require('socket.io');
const fs = require('fs').promises;
const path = require('path');

class FileDao {
  constructor(directoryPath) {
    this.directoryPath = directoryPath;
  }

  async saveFile(fileName, content) {
    const filePath = path.join(this.directoryPath, fileName);
    await fs.writeFile(filePath, content);
    return filePath;
  }

  async readFile(fileName) {
    const filePath = path.join(this.directoryPath, fileName);
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  }

  async deleteFile(fileName) {
    const filePath = path.join(this.directoryPath, fileName);
    await fs.unlink(filePath);
  }
}

let io;

const initializeSocket = (server) => {
  io = new Server(server);

  io.on('connection', (socket) => {
    console.log('Usuario conectado');

    // Evento: Nuevo producto
    socket.on('new-product', (productData) => {
      console.log('Nuevo producto recibido:', productData);
      // Lógica para manejar el nuevo producto
      io.emit('update-products', productData); // Emitir un evento a todos los clientes para actualizar productos
    });

    // Evento: Eliminar producto
    socket.on('delete-product', (productId) => {
      console.log('Eliminar producto con ID:', productId);
      // Lógica para eliminar el producto
      io.emit('product-deleted', productId); // Emitir un evento a todos los clientes para indicar la eliminación del producto
    });

    socket.on('disconnect', () => {
      console.log('Usuario desconectado');
    });
  });
};

module.exports = { FileDao, initializeSocket, io };

