const db = require("../db/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const { Readable } = require("stream");
const { Client } = require("basic-ftp");
const ftpClient = new Client();

const dotenv = require("dotenv");
dotenv.config();

const habilitarEdicion = (req, res) => {
  req.session.editar = true;
  return res.redirect("/dashboard/user");
};

const deleteFile = async (filePath) => {
  try {
    await ftpClient.remove(filePath);
    console.log("Archivo borrado correctamente:", filePath);
  } catch (err) {
    console.error("Error al borrar el archivo:", err);
    throw err;
  }
};

// controlador de registro
const userRegister = async (req, res) => {
  const { username, email, password } = req.body;
  let image = req.file;

  ftpClient.ftp.verbose = true;

  if (image === undefined) {
    image =
      "https://isobarscience.com/wp-content/uploads/2020/09/default-profile-picture1.jpg";
  } else {
    const stream = Readable.from(image.buffer);

    const archivo =
      image.fieldname + "-" + Date.now() + path.extname(image.originalname);

    const ruta = process.env.FTP_PATH + archivo;
    await ftpClient
      .access({
        host: process.env.FTP_HOST,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASSWORD,
        secure: true,
      })
      .then(() => {
        ftpClient.uploadFrom(stream, ruta);
      })
      .then(() => {
        console.log("Archivo subido exitosamente al servidor FTP");
        // Guardar la ruta en la sesión o en la base de datos
        delete req.session.ruta;
        req.session.ruta = process.env.FTP_PATH_WWW + archivo; // Ruta para la base de datos
      })
      .catch((err) => {
        console.error("Error al subir archivo al servidor FTP:", err);
        res.status(500).send("Error interno al subir archivo al servidor FTP.");
      });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const query =
      "INSERT INTO users (username, email, password, url_img) VALUES (?, ?, ?, ?)";

    const [results] = await db.query(query, [
      username,
      email,
      hashedPassword,
      req.session.ruta,
    ]);

    if (req.session.is_admin === "true") {
      req.session.message = "Usuario agregado correctamente";
      return res.redirect("/dashboard/dash-users");
    } else {
      req.session.message = "Bienvenido " + username;
      return res.redirect("/login");
    }
  } catch (error) {
    console.error("Error :", error);
    res.status(500).send("Error durante el registro del usuario");
  }
};

// controlador de login
const userLogin = async (req, res) => {
  const { username, password } = req.body;

  const queryUserData = "SELECT * FROM users WHERE username = ?";

  try {
    const [results] = await db.query(queryUserData, [username]);

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
      { expiresIn: "15m" }
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
      req.session.message = "Panel de Usuario, edite sus datos o cree Tickets";
      return res.redirect("/dashboard/user");
    }
  } catch {
    res.status(500).send("Error al iniciar sesión");
  }
};

// controlador de cerrar sesion
const userLogout = (req, res) => {
  res.clearCookie("token"); // Elimina la cookie del token
  req.session.is_admin = null;
  req.session.message = "Sesión cerrada";
  req.session.editar = "false";
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
      deleteFile(req.session.url_img);
      req.session.url_img = req.session.ruta;
    }

    const query =
      "UPDATE users SET username = ?, email = ? ,password = ?, url_img = ? WHERE user_id = ?";

    const [results] = await db.query(query, [
      username,
      email,
      hashedPassword,
      image,
      user_id,
    ]);

    req.session.username = username;
    req.session.email = email;
    req.session.url_img = image;
    req.session.passUser = hashedPassword;

    req.session.message = "Datos actualizado correctamente";
    return res.redirect("/dashboard/user");
  } catch (err) {
    console.error("Error durante la actualización del usuario:", err);
    return res.status(500).send("Error durante la actualización del usuario");
  }
};

// controlador para eliminar usuario
const userDelete = async (req, res) => {
  const { user_id } = req.params;

  const query = "DELETE FROM users WHERE user_id = ?";

  try {
    const [results] = await db.query(query, [user_id]);
    req.session.message = "Usuario eliminado correctamente";
    return res.redirect("/dashboard/dash-users");
  } catch (err) {
    console.error("Error durante la eliminación del usuario:", err);
    return res.status(500).send("Error durante la eliminación del usuario");
  }
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
