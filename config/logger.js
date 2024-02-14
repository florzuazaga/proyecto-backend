const { createLogger, transports, format } = require('winston');

// Configuración para entorno de desarrollo (devLogger)
const devLogger = createLogger({
  format: format.combine(format.simple(), format.colorize()),
  transports: [new transports.Console()],
});

// Configuración para entorno de producción (prodLogger)
const prodLogger = createLogger({
  format: format.combine(format.simple(), format.json()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Selecciona el logger según el entorno
const logger = process.env.NODE_ENV === 'production' ? prodLogger : devLogger;

module.exports = logger;
