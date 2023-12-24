//auth.js
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const { User } = require('../dao/models/userSchema'); // Modelo de usuario definido en models.js
const { store } = require('./db'); // El store para las sesiones MongoDB
const jwt = require('jsonwebtoken');
const router = express.Router();

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'http://localhost:8080/auth/github/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await User.findOne({ githubId: profile.id });

    if (user) {
      return done(null, user);
    } else {
      const newUser = await User.create({
        githubId: profile.id,
        username: profile.username,
      });

      return done(null, newUser);
    }
  } catch (error) {
    return done(error);
  }
}));

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
// Configuración para generar tokens JWT
function generateJWT(user) {
  const payload = {
    id: user.id, // Puedes incluir cualquier dato relevante aquí
    username: user.username // Por ejemplo, incluimos el nombre de usuario en el token
  };
  const options = {
    expiresIn: '1h' // Tiempo de expiración del token (opcional)
  };
  return jwt.sign(payload, 'secretKey', options); // 'secretKey' debe ser una clave segura
}
// Estrategia Local
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return done(null, false, { message: 'Usuario no encontrado' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return done(null, false, { message: 'Contraseña incorrecta' });
    }

     // Si el usuario y contraseña son correctos, generamos un token JWT
     const token = generateJWT(user);
     return done(null, user, { token }); // Pasamos el token al usuario autenticado
   } catch (error) {
     return done(error);
   }
}));
module.exports = {
  initializePassport: () => {
    return passport.initialize();
  },
  sessionPassport: () => {
    return passport.session();
  },
};

