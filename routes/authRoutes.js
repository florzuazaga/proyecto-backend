// authRoutes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { User } = require('../dao/models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    const { nombre, apellido, email, contraseña, username } = req.body;

    // Verifica si los campos obligatorios están presentes
    if (!username || !email || !contraseña) {
      return res.status(400).json({ message: 'Los campos username, correo electrónico y contraseña son obligatorios.' });
    }

    // Verifica si ya existe un usuario con el mismo correo electrónico
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Ya existe un usuario con este correo electrónico.' });
    }

    // Utiliza bcrypt para hashear la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Crea un nuevo usuario
    const newUser = await User.create({
      nombre,
      apellido,
      email,
      contraseña: hashedPassword,  // Almacena la contraseña hasheada
      username,
    });

    // Genera un token de autenticación
    const token = jwt.sign({ _id: newUser._id, role: newUser.rol }, 'secretKey', {
      expiresIn: '1h',
    });

    res.status(201).json({ message: 'Usuario registrado exitosamente', token });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  try {
    const { username, contraseña } = req.body;

    // Busca el usuario por nombre de usuario
    const user = await User.findOne({ username });

    // Verifica si el usuario existe y si la contraseña coincide
    if (user && await user.comparePassword(contraseña)) {
      // Genera un token de autenticación
      const token = jwt.sign({ _id: user._id, role: user.rol }, 'secretKey', {
        expiresIn: '1h',
      });

      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

// Ruta para mostrar el formulario de inicio de sesión
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  try {
    const { username, contraseña } = req.body; 
    console.log('Username recibido:', username);

    const user = await User.findOne({ username }); 

    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // Verificar que la contraseña almacenada no sea null o undefined
    if (!user.contraseña) {
      console.error('Contraseña almacenada no válida');
      return res.status(500).json({ message: 'Error en la autenticación' });
    }

    console.log('Usuario encontrado:', user);

    const match = await user.comparePassword(contraseña);

    console.log('Coincide la contraseña:', match);

    if (match) {
      const token = user.generateAuthToken();
      res.status(200).json({ token });
    } else {
      console.log('Contraseña incorrecta');
      res.status(401).json({ message: 'Contraseña incorrecta' });
    }
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

module.exports = router;



