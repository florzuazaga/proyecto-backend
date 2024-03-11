
// controllers/authController.js

const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const {UserModel,User} = require('../models/userSchema');

const authRouter = express.Router();

// Controlador para manejar la autenticación del usuario en la ruta POST '/auth/login'
authRouter.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',   // Redirección en caso de autenticación exitosa
  failureRedirect: '/auth/login',  // Redirección en caso de fallo de autenticación
}));

module.exports = authRouter;

// controllers/adminController.js

// Configuración de Passport
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await UserModel.findOne({ username });

      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }

      // Utilizamos bcrypt.compare para comparar la contraseña proporcionada con el hash almacenado
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }
    } catch (error) {
      return done(error);
    }
  }
));

// Función para el dashboard de administrador
function adminDashboard(req, res) {
  res.render('admin-dashboard'); // Renderizar la vista del dashboard de administrador
}

// Función para la gestión de usuarios
function manageUsers(req, res) {
  res.render('manage-users'); // Renderizar la vista para gestionar usuarios
}

// Función para obtener todos los usuarios
async function getAllUsers(req, res) {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
}

// Función para actualizar el rol de un usuario
async function updateUserRole(req, res) {
  const { userId, newRole } = req.body;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.role = newRole;
    await user.save();

    res.json({ message: 'Rol de usuario actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el rol del usuario' });
  }
}

module.exports = {
  adminDashboard,
  manageUsers,
  getAllUsers,
  updateUserRole,
};


