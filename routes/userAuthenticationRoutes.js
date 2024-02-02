// userAuthenticationRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../dao/models/userSchema');

router.post('/login', async (req, res) => {
  try {
    const { username, contraseña } = req.body; 
    console.log('Username recibido:', username);

    const user = await User.findOne({ username }); 

    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(401).json({ message: 'Usuario no encontrado' });
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

module.exports = router;





