// adminController.js

const User = require('../dao/models/userSchema');

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
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
}

// Función para actualizar el rol de un usuario
async function updateUserRole(req, res) {
  const { userId, newRole } = req.body;

  try {
    const user = await User.findById(userId);
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

