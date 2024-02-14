// login.test.js
const { createLogger, transports, format } = require('winston');

// Configuración para entorno de desarrollo
const developmentLogger = createLogger({
  format: format.combine(format.simple(), format.colorize()),
  transports: [new transports.Console({ level: 'verbose' })],  // Cambiado a 'verbose'
});

// Configuración para entorno de producción
const productionLogger = createLogger({
  format: format.combine(format.simple(), format.json()),
  transports: [
    new transports.Console({ level: 'http' }),  // Cambiado a 'http'
    new transports.File({ filename: 'logs/errors.log', level: 'error' }),  // Cambiado a 'error' y 'errors.log'
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Selecciona el logger según el entorno
const logger = process.env.NODE_ENV === 'production' ? productionLogger : developmentLogger;

module.exports = logger;






