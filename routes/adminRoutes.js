// adminRoutes.js
const express = require('express');
const router = express.Router();
const { adminDashboard, manageUsers, getAllUsers } = require('../controllers/adminController');
const { authenticateToken, isAdminMiddleware } = require('../services/adminMiddleware');

// Rutas protegidas para administradores
router.get('/dashboard', authenticateToken, isAdminMiddleware, (req, res) => {
  adminDashboard(req, res);
});

router.get('/manage-users', authenticateToken, isAdminMiddleware, (req, res) => {
  manageUsers(req, res);
});

router.get('/users', authenticateToken, isAdminMiddleware, (req, res) => {
  getAllUsers(req, res);
});

module.exports = router;



