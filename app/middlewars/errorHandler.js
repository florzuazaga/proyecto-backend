//errorHandler.js
// Customizador de errores
function errorHandler(err, req, res, next) {
    console.error(err.stack);
  
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  
    res.status(statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? 'Error de producción' : err.stack,
    });
  }
  
  module.exports = errorHandler;
  