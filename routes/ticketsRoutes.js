const express = require('express');
const router = express.Router();
const ticketController  = require('../controllers/ticketController');
const { authenticateToken } = require('../middlewares/auth');

router.post('/create', authenticateToken, ticketController.create);

router.delete('/borrar/:ticket_id', authenticateToken, ticketController.borrar);

module.exports = router;
