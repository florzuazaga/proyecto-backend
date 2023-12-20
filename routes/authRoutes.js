//authRoutes.js
const express = require('express');
const { authenticateUser } = require('../controllers/authController');
const router = express.Router();


router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const authResult = await authenticateUser(username, password);

    if (!authResult.success) {
      return res.status(401).json({ message: authResult.message });
    }

    req.session.user = authResult.user;
    
    // Redirección después del inicio de sesión
    res.redirect('/dashboard'); // Cambia '/dashboard' por la ruta a la que quieres redirigir al usuario
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error al cerrar sesión' });
    }
    res.json({ message: 'Sesión cerrada correctamente' });
  });
});

module.exports = router;





  