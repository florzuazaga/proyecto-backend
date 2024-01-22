// userAuthenticationRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../dao/models/userSchema');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });



    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const match = await user.comparePassword(password);

    if (match) {
      const token = user.generateAuthToken();
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: 'Contraseña incorrecta' });
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

module.exports = router;




