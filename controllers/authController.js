//authController.js
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const User = require('../dao/models/userSchema'); // Importa tu modelo de usuario aquí

// Configuración de la Estrategia de GitHub
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:8080/auth/github/callback', 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Buscar usuario en la base de datos por su GitHub ID
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
          // Si el usuario no existe, crea uno nuevo
          user = new User({
            githubId: profile.id,
            username: profile.username,
            
          });
          await user.save();
        }

        // Llama a "done" con el usuario para indicar éxito en la autenticación
        done(null, user);
      } catch (error) {
        console.error('Error durante la autenticación con GitHub:', error);
        done(error); // En caso de error, pasa el error a "done"
      }
    }
  )
);

passport.serializeUser((user, done) => {
  // Serializa solo la información necesaria para identificar al usuario (por ejemplo, el ID)
  done(null, user.id);
});


passport.deserializeUser(async (id, done) => {
  try {
    // Deserializa el usuario por su ID
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error); // En caso de error, pasa el error a "done"
  }
});

module.exports = passport;
