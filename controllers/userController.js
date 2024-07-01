const db = require("../db/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const { authenticateToken } = require('../middlewares/auth');

// controlador de registro
const userRegister = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const query =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.execute(query, [username, email, hashedPassword], (err, results) => {
      if (err) {
        console.error("Error durante el registro del usuario:", err);
        return res.status(500).send("Error durante el registro del usuario");
      }
      res.redirect("/login");
      res.status(201).send("Usuario registrado");
    });
  } catch (error) {
    console.error("Error durante el hash de la contraseña:", error);
    res.status(500).send("Error durante el registro del usuario");
  }
};

// controlador de login
const userLogin = (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT * FROM users WHERE username = ?";
  db.execute(query, [username], async (err, results) => {
    if (err) {
      console.error("Error durante el inicio de sesión:", err);
      return res.status(500).send("Error durante el inicio de sesión");
    }
    if (results.length === 0) {
      return res.status(401).send("Nombre de usuario o contraseña incorrectos");
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Nombre de usuario o contraseña incorrectos");
    }

    // Genera el token JWT
    const token = jwt.sign(
      {
        userId: user.user_id,
        username: user.username,
        email: user.email,
        is_admin: user.is_admin,
        url_img: user.url_img,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Configura la cookie con el token
    res.cookie("token", token, { httpOnly: true });

    // Guardar datos en la sesión
    req.session.is_admin = user.is_admin;

    if (user.is_admin === "true") {
      res.redirect("/dashboard");
    } else {
      res.redirect("/user-dashboard");
    }
  });
};

// controlador de cerrar sesion
const userLogout = (req, res) => {
  res.clearCookie("token"); // Elimina la cookie del token
  req.session.is_admin = null;
  res.redirect("/"); // Redirige al usuario a la página principal
};

const getAllUsers = (req, res) => {
  const queryUsers = "SELECT * FROM users";
  
  db.query(queryUsers, (err, usersResults) => {
    if (err) {
      console.error("Error al obtener registros:", err);
      return res.status(500).send("Error al obtener registros");
    }

    const data = {
      users: usersResults,
    };

    // Renderiza la vista 'components/dash-tickets.ejs' y pasa 'data' como dato
    res.render("components/dash-users", { data });
  });
};

module.exports = { userRegister, userLogin, userLogout, getAllUsers };
