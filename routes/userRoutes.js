// userRoutes.js
const express = require('express');
const router = express.Router();
const { paginateUsers, searchUsers } = require('../queries/userQueries');

router.get('/paginate', async (req, res) => {
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

router.get('/search', async (req, res) => {
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
