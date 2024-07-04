const express = require('express');
const router = express.Router();
const ticketController  = require('../controllers/ticketController');
const { authenticateToken } = require('../middlewares/auth');

//controlador para manejar los tickets

module.exports = router;
