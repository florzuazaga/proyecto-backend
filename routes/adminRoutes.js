// adminRoutes.js
const express = require('express');
const router = express.Router();
const { adminDashboard, manageUsers, getAllUsers } = require('../controllers/adminController');
const { authenticateToken, isAdminMiddleware } = require('../services/adminMiddleware');
const { paginateUsers, searchUsers } = require('../Repositories/userQueries');

// Rutas protegidas para administradores
router.get('/admin/dashboard', authenticateToken, isAdminMiddleware, (req, res) => {
  adminDashboard(req, res);
});

router.get('/admin/manage-users', authenticateToken, isAdminMiddleware, (req, res) => {
  manageUsers(req, res);
});

router.get('/admin/users', authenticateToken, isAdminMiddleware, (req, res) => {
  getAllUsers(req, res);
});

// Rutas para usuarios
router.get('/users/paginate', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await paginateUsers(page, limit);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/users/search', async (req, res) => {
  try {
    const searchTerm = req.query.search;
    const result = await searchUsers(searchTerm);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;




