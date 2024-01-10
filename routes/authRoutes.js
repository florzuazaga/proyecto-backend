//authRoutes.js
const express = require('express');
const { User } = require('../dao/models/userSchema'); 
const { authenticateUser } = require('../userAuthenticationRoutes');
const router = express.Router();
const jwt = require('jsonwebtoken');

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


router.post('/register', async (req, res) => {
  try {
    const { nombre, apellido, correo_electronico, edad, contraseña,  username } = req.body;
    // Agrega registros de información para depurar
    console.log('Datos recibidos:', { nombre, apellido, correo_electronico, edad, contraseña, username });
    // Validar que el campo username esté definido y no sea nulo o vacío
    if (!username || !correo_electronico) {
      return res.status(400).json({ message: 'El campo username es obligatorio.' });
    }
       // Validar si ya existe un usuario con el mismo correo electrónico
       const existingUser = await User.findOne({ correo_electronico });
       if (existingUser) {
         return res.status(400).json({ message: 'Ya existe un usuario con este correo electrónico.' });
       }
    const newUser = await User.create({
      nombre,
      apellido,
      correo_electronico,
      edad,
      contraseña,
      username,
    });

    // Genera un token después de guardar el usuario
    const token = jwt.sign({ _id: newUser._id, role: newUser.rol }, 'secretKey', {
      expiresIn: '1h',
    });

    req.session.token = token;

    res.status(201).json({ message: 'Usuario registrado exitosamente', token });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

module.exports = router;

