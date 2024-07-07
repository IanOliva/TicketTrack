const jwt = require("jsonwebtoken");
const { userLogout } = require("../controllers/userController");
const { response } = require("express");

// Middleware para la autentificación, si al ingresar al sistema no hay token,
// se redirije a la ruta de login, de lo contrario, se validará el token y se le redirigira a la ruta dashboard

function authenticateToken(req, res, next) {
  const token = req.cookies.token; // Extrae el token de las cookies

  if (!token) {
    // No hay token, redirije a la ruta de login
    req.session.message = "No hay token";
    res.redirect("/login");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      req.session.message = "Tocken invalido";
      userLogout(req, res); // Token inválido
    }
    req.user = user; // Almacena la información del usuario decodificado en req.user
    next(); // Continúa con el siguiente middleware o controlador
  });
}

// Middleware para verificar si el usuario al ingresar a la ruta es administrador

function checkAdmin(req, res, next) {
  if (req.user) {
    if (req.user.is_admin === "true") {
      next();
    } else {
      res.redirect("/user-dashboard");
    }
  } else {
    userLogout(req, res);
  }
}

// Middleware para verificar si no es admin
function checkUser(req, res, next) {
  if ( req.userData.is_admin === "true") {
    next();
  } else {
    res.redirect("/dashboard/user");
  }
}

const getUserData = async (req, res, next) => {
  try {
    //revisamos que exista userID en la session
    if (!req.session.userId) {
      req.session.message = "Sesión cerrada";
      res.redirect("/login");
    } else {
      req.session.message = "";

      const userId = req.session.userId;
      const username = req.session.username;
      const urlImg = req.session.url_img;
      const is_admin = req.session.is_admin;
      const message = req.session.message;

      req.userData = {
        is_admin,
        userId,
        username,
        urlImg,
        message,
      };

      next();
    }
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).send("Error fetching user data");
  }
};

module.exports = {
  authenticateToken,
  checkAdmin,
  checkUser,
  getUserData,
};
