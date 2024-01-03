// passport.js (passportConfig)
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../dao/models/userSchema'); // Importa tu modelo de usuario
const { verifyToken } = require('./jwtStrategy'); // Importa las funciones de verificación de token

// Configuración de la estrategia local (nombre de usuario y contraseña)
passport.use(
  new LocalStrategy(async (correo_electronico, contraseña, done) => {
    try {
      const user = await User.findOne({ correo_electronico });

      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }

      const isValidPassword = await user.comparePassword(contraseña);

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
  secretOrKey: process.env.JWT_SECRET || 'your_fallback_secret', // Utiliza una variable de entorno
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

module.exports = passport;

