const db = require("../db/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
      { expiresIn: "1w" }
    );

    // Configura la cookie con el token
    res.cookie("token", token, { httpOnly: true });

    // Guardar datos en la sesión
    req.session.is_admin = user.is_admin;
    req.session.userId = user.user_id;

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
  res.redirect("/login"); // Redirige al usuario a la página principal
};

// controlador para modificar usuario
const userUpdate = async (req, res) => {
  const { user_id } = req.params;
  const { username, password } = req.body;

  try {
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const query =
      "UPDATE users SET username = ?, password = ? WHERE user_id = ?";
    db.execute(query, [username, hashedPassword, user_id], (err, results) => {
      if (err) {
        console.error("Error durante la actualización del usuario:", err);
        return res
          .status(500)
          .send("Error durante la actualización del usuario");
      }
      res.send("Usuario actualizado correctamente"); // Redirigir a una página de perfil o donde sea
    });
  } catch (error) {
    console.error("Error durante el hash de la contraseña:", error);
    res.status(500).send("Error durante la actualización del usuario");
  }
};

// controlador para eliminar usuario

const userDelete = (req, res) => {
  const { user_id } = req.params;

  const query = "DELETE FROM users WHERE user_id = ?";
  db.execute(query, [user_id], (err, results) => {
    if (err) {
      console.error("Error durante la eliminación del usuario:", err);
      return res.status(500).send("Error durante la eliminación del usuario");
    }
    res.send("Usuario eliminado correctamente");
  });
};
const getAllUsers = (req, res) => {
  const queryUsers =
    "SELECT *, (select count(*) from tickets where tickets.idUsuario = users.user_id)as cantTickets FROM users";

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

const renderDashHome = (req, res) => {
  const userId = req.userData.userId;
  const queryUsers = "SELECT * FROM users WHERE user_id = ?";

  db.query(queryUsers,[userId], (err, dataPersonal) => {
    if (err) {
      console.error("Error al obtener registros:", err);
      return res.status(500).send("Error al obtener registros");
    }

    const queryTickets = "SELECT * FROM tickets WHERE idUsuario = ?";

    db.query(queryTickets, [userId] , (err, ticketsUsuario) => {
      if (err) {
        console.error("Error al obtener tickets:", err);
        return res.status(500).send("Error al obtener tickets");
      }

      const queryResolvedTickets =
        "SELECT count(*) as total FROM tickets WHERE resueltoPor = ?";

      db.query(
        queryResolvedTickets,
        [req.user.userId],
        (err, ticketsResueltos) => {
          if (err) {
            console.error("Error al obtener tickets resueltos:", err);
            return res.status(500).send("Error al obtener tickets resueltos");
          }

          const data = {
            title: 'Dashboard Home',
            datosUsuario: dataPersonal[0],
            ticketsUsuario: ticketsUsuario,
            ticketsResueltos: ticketsResueltos[0],
          };

          res.render("dashboard", {
            content: 'components/dash-home', // Esto es una referencia a la vista parcial que se cargará
            data, // Pasamos los datos obtenidos a la vista
          });
        }
      );
    });
  });
};

module.exports = {
  userRegister,
  userLogin,
  userLogout,
  userUpdate,
  userDelete,
  getAllUsers,
  renderDashHome,
};
