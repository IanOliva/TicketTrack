const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middlewares/auth');
const { userRegister, userLogin, userLogout } = require('../controllers/userController');


// Ruta de registro
router.post('/register', userRegister);

// Ruta de inicio de sesión
router.post('/login', userLogin);

// Ruta para cerrar sesión
router.get('/logout', userLogout);

module.exports = router;
