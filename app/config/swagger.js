const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'proyecto backend',
      version: '1.0.0',
      description: 'Documentación de la API',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Reemplaza con la URL de tu servidor
        description: 'Servidor local',
      },
    ],
  },
  apis: ['./app/routes/*.js'], // Rutas de tus controladores o archivos de rutas
};

const specs = swaggerJsdoc(options);

module.exports = specs;
