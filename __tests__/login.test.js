// login.test.js
const { createLogger, transports, format } = require('winston');

// Configuración para entorno de prueba
const testLogger = createLogger({
  format: format.combine(format.simple(), format.colorize()),
  transports: [new transports.Console({ level: 'debug' })],  
});

module.exports = testLogger;







