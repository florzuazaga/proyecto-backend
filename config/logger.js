const { createLogger, transports, format } = require('winston');

// Configuración para entorno de desarrollo
const developmentLogger = createLogger({
  format: format.combine(format.simple(), format.colorize()),
  transports: [new transports.Console()],
});

// Configuración para entorno de producción
const productionLogger = createLogger({
  format: format.combine(format.simple(), format.json()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Selecciona el logger según el entorno
const logger = process.env.NODE_ENV === 'production' ? productionLogger : developmentLogger;

module.exports = logger;
