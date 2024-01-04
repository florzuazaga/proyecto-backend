// passport.js (passportConfig)
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./dao/models/userSchema');

passport.use(
  new LocalStrategy({ usernameField: 'correo_electronico' }, async (correo_electronico, contraseña, done) => {
    try {
      const user = await User.findOne({ correo_electronico });

      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }

      const match = await bcrypt.compare(contraseña, user.contraseña);

      if (match) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;

