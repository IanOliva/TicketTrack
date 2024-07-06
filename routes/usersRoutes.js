const express = require("express");
const router = express.Router();
const { authenticateToken, getUserData } = require("../middlewares/auth");
const userController = require("../controllers/userController");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/avatars/'); // Directorio donde se guardarán los archivos
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Nombre del archivo
  }
});

const upload = multer({ storage: storage });

// Ruta de registro
router.post("/register", upload.single('image'), userController.userRegister);

// Ruta de inicio de sesión
router.post("/login", userController.userLogin);

// Ruta para cerrar sesión
router.get("/logout", userController.userLogout);

//Ruta para modificar usuario
router.put(
  "/user-update/:user_id",
  authenticateToken,
  userController.userUpdate
);

//Ruta para borrar usuario
router.get(
  "/user-delete/:user_id",
  authenticateToken,
  userController.userDelete
);

module.exports = router;
