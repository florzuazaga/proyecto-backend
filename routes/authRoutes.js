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
  console.log('Recibida solicitud en /register');
  try {
    // Resto del código para registrar el usuario
    const { nombre, apellido, email, contraseña, username } = req.body;

    if (!username || !email || !contraseña) {
      console.error('Campos obligatorios faltantes');
      return res.status(400).json({ message: 'Los campos username, correo electrónico y contraseña son obligatorios.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error('Ya existe un usuario con este correo electrónico.');
      return res.status(400).json({ message: 'Ya existe un usuario con este correo electrónico.' });
    }

    // Utiliza bcrypt para hashear la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const newUser = await User.create({
      nombre,
      apellido,
      email,
      contraseña: hashedPassword,  // Almacena la contraseña hasheada
      username,
    });

    const token = jwt.sign({ _id: newUser._id, role: newUser.rol }, 'secretKey', {
      expiresIn: '1h',
    });

    req.session.token = token;
    res.status(201).json({ message: 'Usuario registrado exitosamente', token });
  } catch (error) {
    console.error('Error al registrar usuario:', error);

    // Agrega este console.log para imprimir detalles del error en la terminal de VSC
    console.log('Error details:', error);

    res.status(500).json({ message: 'Error al registrar usuario' });
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



