// authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../dao/models/userSchema');
const { authenticateUser } = require('./userAuthenticationRoutes');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Ruta para mostrar el formulario de inicio de sesión
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  try {
    const { email, contraseña } = req.body;
    console.log('req.body:', req.body);
    const authResult = await authenticateUser(email, contraseña);

    if (!authResult.success) {
      console.error('Error de autenticación:', authResult.message); // Agrega este console.log
      return res.status(401).json({ message: authResult.message });
    }

    req.session.user = authResult.user;

    // Redirección después del inicio de sesión
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error al iniciar sesión:', error); // Agrega este console.log
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});


router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  try {
    const { nombre, apellido, email, edad, contraseña, username } = req.body;
    console.log('req.body:', req.body);

    if (!username || !email || !contraseña) {
      console.error('Campos obligatorios faltantes'); // Agrega este console.log
      return res.status(400).json({ message: 'Los campos username, correo electrónico y contraseña son obligatorios.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error('Ya existe un usuario con este correo electrónico.'); // Agrega este console.log
      return res.status(400).json({ message: 'Ya existe un usuario con este correo electrónico.' });
    }

     // Utiliza bcrypt para hashear la contraseña
 const hashedPassword = await bcrypt.hash(contraseña, 10);

 const newUser = await User.create({
   nombre,
   apellido,
   email,
   edad,
   contraseña: hashedPassword,  // Almacena la contraseña hasheada
   username,
 });

 const token = jwt.sign({ _id: newUser._id, role: newUser.rol }, 'secretKey', {
   expiresIn: '1h',
 });

 req.session.token = token;
 res.status(201).json({ message: 'Usuario registrado exitosamente', token });

  } catch (error) {
    console.error('Error al registrar usuario:', error); // Agrega este console.log
    res.status(500).json({ message: 'Error al registrar usuario' });
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


