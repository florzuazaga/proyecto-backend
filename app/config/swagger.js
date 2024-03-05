//swagger.js
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
        url: 'http://localhost:8080', 
        description: 'Servidor local',
      },
    ],
  },
  apis: ['./routes/*.js'], // Rutas 
};

const specs = swaggerJsdoc(options);

module.exports = specs;
