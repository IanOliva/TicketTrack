const express = require("express");
const router = express.Router();
const { authenticateToken, getUserData } = require("../middlewares/auth");
const userController = require("../controllers/userController");

// Ruta de registro
router.post("/register", getUserData , userController.userRegister);

// Ruta de inicio de sesión
router.post("/login", userController.userLogin);

// Ruta para cerrar sesión
router.get("/logout", userController.userLogout);

//Ruta para modificar usuario

router.put("/user-update/:user_id", authenticateToken,  userController.userUpdate);

//Ruta para borrar usuario
router.get("/user-delete/:user_id",authenticateToken, userController.userDelete);

module.exports = router;