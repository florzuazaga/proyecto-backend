const User = require('../dao/models/userSchema');

async function authenticateUser(username, password) {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Contraseña incorrecta' };
    }

    // Asignar un rol especial basado en credenciales
    if (username === 'adminCoder@coder.com' && password === 'adminCod3r123') {
      user.role = 'admin';
    } else {
      user.role = 'usuario';
    }

    return { success: true, user };
  } catch (error) {
    return { success: false, message: 'Error al autenticar el usuario' };
  }
}

module.exports = { authenticateUser };

