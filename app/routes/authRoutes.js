//authRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const { User } = require('../models/userSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');



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
      contraseña: hashedPassword,
      username,
    });

    // Genera un token de autenticación
    const token = jwt.sign({ _id: newUser._id, role: newUser.rol }, 'secretKey', {
      expiresIn: '1h',
    });
    res.status(201).json({ message: 'Usuario registrado exitosamente', token });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.username === 1) {
      // Si el error es debido a un nombre de usuario duplicado
      return res.status(400).json({ message: 'Ya existe un usuario con este nombre de usuario. Por favor, elige otro.' });
    }

    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

// Ruta para iniciar sesión con Passport (sesiones)
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/auth/login',
}), (req, res) => {
  // Si la autenticación es exitosa, llegarás aquí
  logger.info('Inicio de sesión exitoso', { user: req.user }); // Registro de éxito con info
  res.status(200).json({ message: 'Inicio de sesión exitoso', user: req.user });
  // Redirige a la vista de productos
  res.redirect('/api/products');
});

// Ruta para iniciar sesión con JWT
router.post('/login-jwt', async (req, res) => {
  try {
    const { username, contraseña } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      logger.error('Usuario no encontrado'); // Registro de error con error
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // Imprime la contraseña almacenada en la base de datos y la contraseña proporcionada por el usuario
    console.log('Contraseña almacenada en la base de datos:', user.contraseña);
    console.log('Contraseña proporcionada por el usuario:', contraseña);

    // Continúa con la comparación de contraseñas
    const match = await user.comparePassword(contraseña);

    if (match) {
      logger.info('Inicio de sesión exitoso', { user }); // Registro de éxito con info
      const token = user.generateAuthToken();
      res.status(200).json({ token });
    } else {
      logger.error('Contraseña incorrecta'); // Registro de error con error
      res.status(401).json({ message: 'Contraseña incorrecta' });
    }
  } catch (error) {
    logger.error('Error al iniciar sesión:', error); // Registro de error con error
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});
// Ruta para mostrar el formulario de inicio de sesión
router.get('/login', (req, res) => {
  res.render('login');
});
// Ruta para obtener información del usuario actual
router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
  try {
    // Aquí obtienes el usuario desde la solicitud (ya autenticado por la estrategia 'current')
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    // Crear un DTO del usuario con la información necesaria
    const userDto = new UserDto(user);

    // Enviar el DTO como respuesta
    res.status(200).json(userDto);
  } catch (error) {
    // Manejar errores, si es necesario
    console.error('Error al obtener información del usuario:', error);
    res.status(500).json({ message: 'Error al obtener información del usuario' });
  }
});
// Ruta para cerrar sesión
router.post('/logout', (req, res) => {
  req.logout(); // Esta función es proporcionada por Passport para limpiar la sesión
  res.json({ message: 'Sesión cerrada correctamente' });
});

module.exports = router;





