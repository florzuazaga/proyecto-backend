// auth.js
const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

const { User } = require('./models'); // Suponiendo que tienes un modelo de usuario definido en models.js
const { store } = require('./db'); // El store para las sesiones MongoDB

// Configuración de la estrategia local para Passport (registro e inicio de sesión)
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });

      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// Configuración de la estrategia GitHub para Passport (autenticación con GitHub)
passport.use(
  new GitHubStrategy(
    {
      clientID: 'tu_client_id',
      clientSecret: 'tu_client_secret',
      callbackURL: 'http://localhost:3000/auth/github/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Aquí deberías buscar o crear un usuario en tu base de datos utilizando la información del perfil de GitHub
        // Luego, retorna el usuario a través de done
      } catch (error) {
        return done(error);
      }
    }
  )
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

module.exports = {
  initializePassport: () => {
    return passport.initialize();
  },
  sessionPassport: () => {
    return passport.session();
  },
};
