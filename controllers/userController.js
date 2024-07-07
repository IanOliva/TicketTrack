const db = require("../db/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');

const habilitarEdicion = (req, res) => {
  req.session.editar = true;
  res.redirect("/dashboard/user");
};

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error al borrar el archivo:", err);
    } else {
      console.log("Archivo borrado");
    }
  });
};

// controlador de registro
const userRegister = async (req, res, next) => {
  const { username, email, password } = req.body;
  const image = req.file;

  try {
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Verificar si el archivo de imagen está presente
    const imagePath = image ? req.session.ruta : null;

    const query =
      "INSERT INTO users (username, email, password, url_img) VALUES (?, ?, ?, ?)";
    db.execute(
      query,
      [username, email, hashedPassword, imagePath],
      (err, results) => {
        if (err) {
          console.error("Error durante el registro del usuario:", err);
          return res.status(500).send("Error durante el registro del usuario");
        }
        if (req.session.userId) {
          req.session.message = "Usuario agregado correctamente";
          return res.redirect("/dashboard/dash-users");
        } else {
          req.session.message = "Bienvenido " + username;
          return res.redirect("/login");
        }
      }
    );
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
      req.session.message = "Nombre de usuario o contraseña incorrectos";
      res.redirect("/login");
    }

    // Genera el token JWT
    const token = jwt.sign(
      {
        userId: user.user_id,
        username: user.username,
        email: user.email,
        is_admin: user.is_admin,
        url_img: user.url_img,
        passUser: user.password,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Configura la cookie con el token
    res.cookie("token", token, { httpOnly: true });

    // Guardar datos en la sesión
    req.session.is_admin = user.is_admin;
    req.session.userId = user.user_id;
    req.session.username = user.username;
    req.session.url_img = user.url_img;
    req.session.email = user.email;
    req.session.passUser = user.password;

    if (user.is_admin === "true") {
      res.redirect("/dashboard/dash-admin");
    } else {
      res.redirect("/dashboard/user");
    }
  });
};

// controlador de cerrar sesion
const userLogout = (req, res) => {
  res.clearCookie("token"); // Elimina la cookie del token
  req.session.is_admin = null;
  delete req.session.message;
  delete req.session.editar;
  res.redirect("/login"); // Redirige al usuario a la página principal
};

// controlador para modificar usuario
const userUpdate = async (req, res) => {
  delete req.session.editar;
  const { user_id } = req.params;
  let image = req.file;
  let { username, password, email } = req.body;

  let hashedPassword = "";

  try {
    username = username === "" ? req.session.username : username;
    email = email === "" ? req.session.email : email;
    image = image === undefined ? req.session.url_img : image;
    hashedPassword = password === "" ? req.session.passUser : await bcrypt.hash(password, 10);

    // verificamos si la imagen es diferente a la que ya tenia el usuario
    if (image !== req.session.url_img) {
      const oldImagePath = path.join(__dirname,"../public",req.session.url_img);
      deleteFile(oldImagePath);
      req.session.url_img = req.session.ruta
    }


    const query =
      "UPDATE users SET username = ?, password = ?, url_img = ? WHERE user_id = ?";
    db.execute(query, [username, hashedPassword, req.session.ruta, user_id ], (err, results) => {
      if (err) {
        console.error("Error durante la actualización del usuario:", err);
        return res
          .status(500)
          .send("Error durante la actualización del usuario");
      }
      req.session.message = "Datos actualizado correctamente";
      res.redirect("/dashboard/user");
    });
  } catch (error) {
    console.error("Se encontro error", error);
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
    req.session.message = "Usuario eliminado correctamente";
    res.redirect("/dashboard/dash-users");
  });
};

module.exports = {
  userRegister,
  userLogin,
  userLogout,
  habilitarEdicion,
  userUpdate,
  userDelete,
};
