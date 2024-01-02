const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../dao/models/userSchema');

// Ruta para mostrar el formulario de registro
router.get('/register', (req, res) => {
  // Verificar si la conexión a la base de datos está lista
  if (mongoose.connection.readyState !== 1) {
    return res.status(500).json({ error: 'Error de conexión a la base de datos' });
  }

  res.render('register'); // Renderiza el formulario de registro utilizando tu motor de plantillas
});

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
    try {
      // Verificar si la conexión a la base de datos está lista
      if (mongoose.connection.readyState !== 1) {
        return res.status(500).json({ error: 'Error de conexión a la base de datos' });
      }
  
      // Resto del código para registrar el usuario
      const { nombre, apellido, correo_electronico, contraseña } = req.body;
      const newUser = new User({ nombre, apellido, correo_electronico, contraseña });
      await newUser.save();
  
      res.status(200).send('Registro exitoso');
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      res.status(500).json({ error: 'Error al procesar la solicitud', details: error.message });
    }
  });
module.exports = router;
