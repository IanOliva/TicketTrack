const db = require("../db/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { Client } = require("basic-ftp");
const ftpClient = new Client();

ftpClient.ftp.verbose = true; // Puedes habilitar esto para ver detalles de la conexión en la consola
ftpClient.ftp.overwrite = 'all';
ftpClient.ftp.secure = true;
ftpClient.ftp.authType = 'tls';

const habilitarEdicion = (req, res) => {
  req.session.editar = true;
  return res.redirect("/dashboard/user");
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
  let image = req.file;

  const ruta =
    "avatars/" +
    image.fieldname +
    "-" +
    Date.now() +
    path.extname(image.originalname);
  ftpClient
    .access({
      host: "ftp-tickettrack2024.alwaysdata.net",
      user: "tickettrack2024_ftp",
      password: "2C@WjbiUv!n!zX6",
    })
    .then(() => {
      return ftpClient.upload(image.buffer, ruta);
    })
    .then(() => {
      console.log("Archivo subido exitosamente al servidor FTP");
      // Guardar la ruta en la sesión o en la base de datos
      req.session.ruta = "/" + ruta; // Ruta para la base de datos
      // Llamar al controlador para procesar el registro con la ruta del archivo
      userController.userRegister(req, res);
    })
    .catch((err) => {
      console.error("Error al subir archivo al servidor FTP:", err);
      res.status(500).send("Error interno al subir archivo al servidor FTP.");
    });

  // if (image === undefined) {
  //   image =
  //     "https://isobarscience.com/wp-content/uploads/2020/09/default-profile-picture1.jpg";
  // } else {
  //   image = req.session.ruta;
  // }

  // const hashedPassword = await bcrypt.hash(password, 10);

  // try {
  //   // Hash de la contraseña

  //   const query =
  //     "INSERT INTO users (username, email, password, url_img) VALUES (?, ?, ?, ?)";
  //   db.execute(
  //     query,
  //     [username, email, hashedPassword, image],
  //     (err, results) => {
  //       if (err) {
  //         console.error("Error durante el registro del usuario:", err);
  //         return res.status(500).send("Error durante el registro del usuario");
  //       }
  //       if (req.session.userId) {
  //         req.session.message = "Usuario agregado correctamente";
  //         return res.redirect("/dashboard/dash-users");
  //       } else {
  //         req.session.message = "Bienvenido " + username;
  //         return res.redirect("/login");
  //       }
  //     }
  //   );
  // } catch (error) {
  //   console.error("Error :", error);
  //   res.status(500).send("Error durante el registro del usuario");
  // }
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
      req.session.message = "No existe el usuario";
      return res.redirect("/login");
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      req.session.message = "Nombre de usuario o contraseña incorrectos";
      return res.redirect("/login");
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
      return res.redirect("/dashboard/dash-admin");
    } else {
      return res.redirect("/dashboard/user");
    }
  });
};

// controlador de cerrar sesion
const userLogout = (req, res) => {
  res.clearCookie("token"); // Elimina la cookie del token
  req.session.is_admin = null;
  delete req.session.message;
  delete req.session.editar;
  return res.redirect("/login"); // Redirige al usuario a la página principal
};

// controlador para modificar usuario
const userUpdate = async (req, res) => {
  delete req.session.editar;
  const { user_id } = req.params;
  let { username, password, email } = req.body;
  let image = req.file;

  let hashedPassword = "";

  try {
    username = username === "" ? req.session.username : username;
    email = email === "" ? req.session.email : email;
    image = image === undefined ? req.session.url_img : req.session.ruta;
    hashedPassword =
      password === "" ? req.session.passUser : await bcrypt.hash(password, 10);

    // verificamos si la imagen es diferente a la que ya tenia el usuario
    if (image !== req.session.url_img) {
      const oldImagePath = path.join(
        __dirname,
        "../public",
        req.session.url_img
      );
      deleteFile(oldImagePath);
      req.session.url_img = req.session.ruta;
    }

    const query =
      "UPDATE users SET username = ?, email = ? ,password = ?, url_img = ? WHERE user_id = ?";
    db.execute(
      query,
      [username, email, hashedPassword, image, user_id],
      (err, results) => {
        if (err) {
          console.error("Error durante la actualización del usuario:", err);
          return res
            .status(500)
            .send("Error durante la actualización del usuario");
        }
        req.session.message = "Datos actualizado correctamente";
        return res.redirect("/dashboard/user");
      }
    );
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
    return res.redirect("/dashboard/dash-users");
  });
};

const volver = (req, res) => {
  req.session.editar = false;
  return res.redirect("/dashboard/dash-users");
};

module.exports = {
  userRegister,
  userLogin,
  userLogout,
  habilitarEdicion,
  userUpdate,
  userDelete,
  volver,
};
