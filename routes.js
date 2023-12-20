// routes.js
const express = require('express');
const router = express.Router();

const productsRoutes = require('./routes/productsRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

router.use('/products', productsRoutes);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);

module.exports = router;

