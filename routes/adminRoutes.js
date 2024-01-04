// adminRoutes.js
const express = require('express');
const router = express.Router();
const {  adminDashboard, manageUsers, getAllUsers } = require('../controllers/adminController');
const { isAdminMiddleware } = require('../middlewares/adminMiddleware');
// Rutas protegidas para administradores
router.get('/dashboard', isAdminMiddleware, adminDashboard);
router.get('/manage-users', isAdminMiddleware, manageUsers);
router.get('/users', isAdminMiddleware, getAllUsers);

module.exports = router;

