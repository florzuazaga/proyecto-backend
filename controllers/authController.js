const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const User = require('../dao/models/userSchema'); // Importa tu modelo de usuario aquí


passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:8080/auth/github/callback', // Coloca tu URL de callback
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
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
        done(error); // En caso de error, pasa el error a "done"
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});


