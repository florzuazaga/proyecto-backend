// passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwtPassport = require('./jwtStrategy'); // Importa tu estrategia JWT desde jwtStrategy.js
const bcrypt = require('bcryptjs');
const User = require('../dao/models/userSchema'); // Importa tu modelo de usuario

// Configuración de la estrategia local (nombre de usuario y contraseña)
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });

      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// Configuración de la estrategia JWT (ya definida en jwtStrategy.js)
passport.use('current', jwtPassport);

// Funciones para generar y verificar tokens JWT (puedes mantenerlas como están)
const generateToken = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
    
  };

  return jwtPassport.sign(payload, jwtPassport.secretOrKey);
};

const verifyToken = (token) => {
  return jwtPassport.verify(token, jwtPassport.secretOrKey);
};

module.exports = {
  generateToken,
  verifyToken,
};

