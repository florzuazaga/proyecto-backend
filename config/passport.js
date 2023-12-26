const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
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

// Configuración de la estrategia JWT
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_secret_key', // Puedes almacenar esto en una variable de entorno
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

// Funciones para generar y verificar tokens JWT
const generateToken = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
    // Otros campos que desees incluir en el token
  };

  return jwt.sign(payload, jwtOptions.secretOrKey);
};

const verifyToken = (token) => {
  return jwt.verify(token, jwtOptions.secretOrKey);
};

module.exports = {
  generateToken,
  verifyToken,
};
