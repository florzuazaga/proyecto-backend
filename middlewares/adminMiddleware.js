// adminMiddleware.js

function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
      // Si el usuario es un administrador, permite continuar
      next();
    } else {
      // Si el usuario no es administrador, devuelve un error de acceso
      res.status(403).send('Acceso denegado. No eres un administrador.');
    }
  }
  
  module.exports = { isAdmin };
  

