const express = require('express');
const router = express.Router();
const ticketController  = require('../controllers/ticketController');
const { authenticateToken } = require('../middlewares/auth');

router.get('/dashboard', authenticateToken);

router.get('/dash-home', authenticateToken, ticketController.getAdminDashboard);

router.get('/dash-tickets', authenticateToken, ticketController.getAllTickets);

router.get('/user-dashboard', authenticateToken, ticketController.getUserDashboard);

module.exports = router;
