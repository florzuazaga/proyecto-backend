//authRoutes.js
const express = require('express');
const { authenticateUser } = require('../userAuthenticationRoutes');
const router = express.Router();

// Rutas de autenticación y autorización
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  try {
    const { correo_electronico, contraseña } = req.body;
    const authResult = await authenticateUser(correo_electronico, contraseña);

    if (!authResult.success) {
      return res.status(401).json({ message: authResult.message });
    }

    req.session.user = authResult.user;
    
    // Redirección después del inicio de sesión
    res.redirect('/dashboard'); 
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
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

router.get('/register', (req, res) => {
  res.render('register'); // Renderiza el formulario de registro utilizando tu motor de plantillas
});


module.exports = router;





  