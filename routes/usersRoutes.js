const express = require("express");
const router = express.Router();
const { authenticateToken, getUserData } = require("../middlewares/auth");
const userController = require("../controllers/userController");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/avatars/"); // Directorio donde se guardarán los archivos
  },
  filename: function (req, file, cb) {
    const ruta = file.fieldname + "-" + Date.now();
    req.session.ruta = "/avatars/" + ruta + path.extname(file.originalname); // ruta para la base de datos
    cb(null, ruta + path.extname(file.originalname)); // Nombre del archivo
  },
});

const upload = multer({ storage: storage });

// Ruta de registro
router.post("/register", upload.single("image"), userController.userRegister);

// Ruta de inicio de sesión
router.post("/login", userController.userLogin);

// Ruta para cerrar sesión
router.get("/logout", userController.userLogout);

router.get("/volver", userController.volver);


//Ruta para Habilitar la edicion
router.get(
  "/user-habilitar-update",
  authenticateToken,
  userController.habilitarEdicion
);

//Ruta para modificar usuario
router.post(
  "/user-update/:user_id",
  upload.single("image"),
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
