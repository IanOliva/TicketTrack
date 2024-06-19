const express = require('express');
const router = express.Router();
const { getDashboardInfo } = require('../controllers/ticketController');
const { authenticateToken } = require('../middlewares/auth');

router.get('/dashboard-info', authenticateToken, getDashboardInfo);

module.exports = router;
