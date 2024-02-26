//  routes.js
const express = require('express');
const router = express.Router();

// Ruta para una operación sencilla
router.get('/operacion-sencilla', (req, res) => {
  res.json({ message: 'Operación sencilla completada exitosamente' });
});
// Ruta para una operación compleja
router.get('/operacion-compleja', async (req, res) => {
    // Simular una operación que demora tiempo (puede ser una consulta a la base de datos, un cálculo complejo, etc.)
    await new Promise(resolve => setTimeout(resolve, 5000)); // Simulando una espera de 5 segundos
    res.json({ message: 'Operación compleja completada exitosamente' });
  });
module.exports = router;
