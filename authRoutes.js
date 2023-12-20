const express = require('express');
const passport = require('passport');
const router = express.Router();
const authRouter = express.Router();

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  // Redirecciona después de la autenticación exitosa
  res.redirect('/dashboard'); // Cambia '/dashboard' por la ruta deseada
});
// Configuración de rutas de autenticación
authRouter.get('/login', (req, res) => {
    // Lógica para mostrar el formulario de inicio de sesión
    res.render('login'); // Renderiza el formulario de inicio de sesión
  });
  
// Lógica simulada para usuarios (puedes sustituir esto por llamadas a una base de datos)
let users = [];

// Página de registro
router.get('/signup', (req, res) => {
  res.render('signup'); // Renderiza el formulario de registro
});

// Proceso de registro de usuario
router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  
  // Validación básica (puedes implementar tu propia lógica de validación aquí)
  if (!username || !password) {
    return res.status(400).send('Nombre de usuario y contraseña son obligatorios');
  }

  // Verificar si el usuario ya existe
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).send('El nombre de usuario ya está en uso');
  }

  // Crear un nuevo usuario (simulación)
  const newUser = { username, password };
  users.push(newUser);

  res.status(201).send('Usuario registrado exitosamente');
});

// Página de inicio de sesión
router.get('/login', (req, res) => {
  res.render('login'); // Renderiza el formulario de inicio de sesión
});

// Proceso de inicio de sesión
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Buscar el usuario en la lista (simulación)
  const user = users.find(user => user.username === username && user.password === password);
  
  if (!user) {
    return res.status(401).send('Credenciales inválidas');
  }

  // Simular almacenamiento de usuario en sesión
  req.session.user = user;

  res.status(200).send('Inicio de sesión exitoso');
});

// Proceso de cierre de sesión
router.post('/logout', (req, res) => {
  // Destruir la sesión
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error al cerrar sesión');
    }
    res.clearCookie('connect.sid'); // Limpiar la cookie de sesión
    res.status(200).send('Sesión cerrada exitosamente');
  });
});

module.exports = router;
