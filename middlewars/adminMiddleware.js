//adminMiddleware.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const tokenHeader = req.headers['authorization'];

  if (!tokenHeader) {
    return res.status(401).json({ message: 'Acceso no autorizado: Falta el token de autorización' });
  }

  // El valor de Authorization generalmente tiene el formato "Bearer <token>"
  const [bearer, token] = tokenHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Acceso no autorizado: Formato de token inválido' });
  }

  jwt.verify(token, 'secretKey', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }

    // Almacena el usuario decodificado en la solicitud para su uso posterior
    req.user = user;

    // Continuar con la ejecución del siguiente middleware o ruta
    next();
  });
}
function isAdminMiddleware(req, res, next) {
  // Verificar si el usuario tiene privilegios de administrador
  if (req.user && req.user.role === 'admin') {
    // Si es un administrador, continúa con la ejecución del siguiente middleware o ruta
    next();
  } else {
    // Si no es un administrador, devuelve un error de acceso no autorizado
    return res.status(403).json({ message: 'Acceso no autorizado: No eres un administrador' });
  }
}

module.exports = { authenticateToken, isAdminMiddleware };


  

