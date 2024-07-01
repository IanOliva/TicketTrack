const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const userController = require('../controllers/userController');
const { getAdminDashboard, getUserDashboard } = require('../controllers/ticketController');


// Ruta de registro
router.post('/register', userController.userRegister);

// Ruta de inicio de sesión
router.post('/login', userController.userLogin);

// Ruta para cerrar sesión
router.get('/logout', userController.userLogout);

// Ruta para el dashboard

router.get('/user-dashboard', authenticateToken, getUserDashboard );

router.get('/dashboard', authenticateToken, getAdminDashboard );

router.get('/dash-users', authenticateToken, userController.getAllUsers);

router.get('/dash-admin', authenticateToken, userController.getAdminData);

router.get('/user-panel', authenticateToken, userController.getUser_Panel);

module.exports = router;
