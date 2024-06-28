const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const { userRegister, userLogin, userLogout } = require('../controllers/userController');
const { getAdminDashboard, getUserDashboard } = require('../controllers/ticketController');


// Ruta de registro
router.post('/register', userRegister);

// Ruta de inicio de sesión
router.post('/login', userLogin);

// Ruta para cerrar sesión
router.get('/logout', userLogout);

// Ruta para el dashboard

router.get('/user-dashboard', authenticateToken, getUserDashboard );

router.get('/dashboard', authenticateToken, getAdminDashboard );

module.exports = router;
