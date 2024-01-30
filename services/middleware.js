// middleware.js
const validatePurchaseData = (req, res, next) => {
    // Verificar si la solicitud está relacionada con la compra del carrito
    if (req.path.includes('/purchase/')) {
      // Validar los datos del cliente
      const { products, totalPrice, user, date } = req.body;
  
      if (!Array.isArray(products) || !totalPrice || !user || !date) {
        return res.status(400).json({ status: 'error', error: 'Datos de compra incompletos o en formato incorrecto' });
      }
    }
  
    // Continuar con la ejecución normal
    next();
  };
  
  module.exports = {
    validatePurchaseData,
  };
  