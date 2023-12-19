//authController.js
const User = require('../dao/models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10; // Número de rondas de sal para bcrypt


async function authenticateUser(username, password) {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    // Comparación segura de contraseñas usando bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { success: false, message: 'Contraseña incorrecta' };
    }

    // Generar un token de autenticación
    const token = jwt.sign({ userId: user._id, username: user.username }, 'secreto_del_token', { expiresIn: '1h' });
    
   // Retornar el token junto con el usuario autenticado
   return { success: true, user, token }; // Incluir el token en la respuesta
  } catch (error) {
    return { success: false, message: 'Error al autenticar el usuario' };
  }
}


async function createUser(username, email, password) {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear un nuevo usuario con la contraseña hasheada
    const newUser = new User({
      username,
      email,
      password: hashedPassword, // Almacenar la contraseña hasheada en la base de datos
    });

    // Guardar el nuevo usuario en la base de datos
    await newUser.save();

    return { success: true, user: newUser };
  } catch (error) {
    return { success: false, message: 'Error al crear el usuario' };
  }
}
module.exports = { authenticateUser, createUser };

