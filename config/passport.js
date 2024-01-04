// passport.js (passportConfig)
const passport = require('passport');
const passportJWT = require('passport-jwt');
const { ExtractJwt } = passportJWT;
const User = require('./models/userSchema'); // Ajusta la ruta según tu estructura de archivos

const jwtSecretKey = 'yourSecretKey'; // Cambia esto y considera usar variables de entorno

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecretKey,
};

// Estrategia para la autenticación JWT
passport.use(
  'jwt',
  new passportJWT.Strategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.sub);

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

// Estrategia "current" para obtener el usuario asociado a un token de cookie
passport.use(
  'current',
  new passportJWT.Strategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.sub);

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

module.exports = passport;
