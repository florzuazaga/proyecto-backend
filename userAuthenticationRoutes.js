// userAuthenticationRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('../passportConfig');
const bcrypt = require('bcrypt');
const User = require('../dao/models/userSchema');

router.get('/login', (req, res) => {
  res.render('login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth/login',
    failureFlash: true,
  })
);

router.post('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { nombre, apellido, correo_electronico, contraseña } = req.body;

  try {
    const existingUser = await User.findOne({ correo_electronico });

    if (existingUser) {
      return res.status(400).send('El usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const newUser = await User.create({
      nombre,
      apellido,
      correo_electronico,
      contraseña: hashedPassword,
    });

    res.redirect('/auth/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al registrar el usuario');
  }
});

module.exports = router;



