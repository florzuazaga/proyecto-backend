//adminRoutes.js
const express = require('express');
const router = express.Router();
const {  adminDashboard, manageUsers, getAllUsers } = require('../controllers/adminController');
const { isAdmin } = require('../middlewares/adminMiddleware');

// Rutas protegidas para administradores
router.get('/dashboard', isAdmin, adminDashboard);
router.get('/manage-users', isAdmin, manageUsers);
router.get('/users', isAdmin, getAllUsers);

module.exports = router;
