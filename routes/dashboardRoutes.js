const express = require('express');
const router = express.Router();
const dashboardController  = require('../controllers/dashboardController');
const auth = require('../middlewares/auth');

router.get('/dash-admin', auth.getUserData, auth.authenticateToken, dashboardController.renderDashHome);

module.exports = router;
