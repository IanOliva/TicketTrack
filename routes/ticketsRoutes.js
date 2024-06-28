const express = require('express');
const router = express.Router();
const ticketController  = require('../controllers/ticketController');
const { authenticateToken } = require('../middlewares/auth');

router.get('/dashboard', authenticateToken, ticketController.getAdminDashboard);

router.get('/user-dashboard', authenticateToken, ticketController.getUserDashboard);

module.exports = router;
