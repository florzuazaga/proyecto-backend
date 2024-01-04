// controllers/login.js

const express = require('express');
const passport = require('passport');

const router = express.Router();

// Controlador para manejar la autenticación del usuario en la ruta POST '/auth/login'
router.post('/', passport.authenticate('local', {
  successRedirect: '/dashboard',   // Redirección en caso de autenticación exitosa
  failureRedirect: '/auth/login',  // Redirección en caso de fallo de autenticación
  failureFlash: true  // Habilita los mensajes flash en caso de fallo de autenticación (si estás utilizando connect-flash)
}));

module.exports = router;
