// passport.js (passportConfig)
const passport = require('passport');
const passportJWT = require('passport-jwt');
const { ExtractJwt } = passportJWT;
const User = require('../dao/models/userSchema'); 

// Usar variables de entorno para claves secretas
const jwtSecretKey = process.env.JWT_SECRET_KEY || 'defaultSecretKey';

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecretKey,
};

// Función común para estrategia JWT
const jwtStrategyCallback = async (payload, done) => {
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
};

// Estrategias JWT y current utilizando la función común
passport.use('jwt', new passportJWT.Strategy(jwtOptions, jwtStrategyCallback));
passport.use('current', new passportJWT.Strategy(jwtOptions, jwtStrategyCallback));

module.exports = passport;

