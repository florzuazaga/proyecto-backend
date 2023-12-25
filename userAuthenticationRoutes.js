const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

// Simulación de base de datos de usuarios
const users = [];

// Función para generar un token JWT
function generateToken(user) {
  const payload = {
    username: user.username,
  };
  return jwt.sign(payload, 'secretKey', { expiresIn: '1h' }); 
}

// Ruta de inicio de sesión
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Buscar el usuario en la simulación de base de datos
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(401).send('Credenciales inválidas');
  }

  // Verificar la contraseña encriptada
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).send('Credenciales inválidas');
  }

  // Generar un token JWT
  const token = generateToken(user);

  // Enviar el token como respuesta
  res.status(200).json({ token });
});

// Middleware para verificar el token en rutas protegidas
function authenticateToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send('Token no proporcionado');
  }

  jwt.verify(token, 'secretKey', (err, user) => {
    if (err) {
      return res.status(403).send('Token inválido');
    }
    req.user = user; // Almacena la información del usuario decodificado en el objeto de solicitud
    next(); // Continúa con la solicitud
  });
}

// Ejemplo de una ruta protegida que requiere autenticación con el token
router.get('/protected', authenticateToken, (req, res) => {
  // Si llega aquí, el token fue verificado con éxito y el usuario está autenticado
  res.status(200).send('Ruta protegida, usuario autenticado');
});

module.exports = router;


