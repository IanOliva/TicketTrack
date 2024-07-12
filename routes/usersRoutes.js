const express = require("express");
const router = express.Router();
const { authenticateToken, getUserData } = require("../middlewares/auth");
const userController = require("../controllers/userController");
const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  fileFilter: function(req, file, cb) {
    const filetypes = /webp|gif|jpeg|jpg|png|jfif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Error: Solo se permiten imágenes jpeg/jpg/png!");
  }
});


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
