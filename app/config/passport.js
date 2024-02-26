// passportConfig.js
const passport = require('passport');
const bcrypt = require('bcrypt');
const GitHubStrategy = require('passport-github2').Strategy;
const { User } = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const { ExtractJwt } = require('passport-jwt');
require('dotenv').config();
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;

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
    id: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: '1h',
  };
  return jwt.sign(payload, 'secretKey', options);
}

// Estrategia Local
passport.use(new LocalStrategy({ usernameField: 'username' }, async (username, password, done) => {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return done(null, false, { message: 'Usuario no encontrado' });
    }

    const passwordMatch = await bcrypt.compare(password, user.contraseña);

    if (!passwordMatch) {
      return done(null, false, { message: 'Contraseña incorrecta' });
    }

    const token = generateJWT(user);
    return done(null, user, { token });
  } catch (error) {
    return done(error);
  }
}));

// Estrategia JWT
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'secretKey',
};

passport.use('current', new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    return done(error, false);
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



