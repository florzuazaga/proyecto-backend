// app.js

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('./authRoutes');
const exphbs = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Configuración de las rutas de autenticación
app.use('/', authRoutes);

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;

























