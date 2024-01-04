// adminMiddleware.js
const jwt = require('jsonwebtoken');

function isAdminMiddleware(req, res, next) {
  // Verificar si el usuario tiene el rol de administrador
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Acceso no autorizado para administradores' });
  }
}
function authenticateToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Acceso no autorizado' });
  }

  jwt.verify(token, 'secretKey', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
}

module.exports = {isAdminMiddleware, authenticateToken };

  

