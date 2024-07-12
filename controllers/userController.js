const db = require("../db/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const { Readable } = require("stream");
const { Client } = require("basic-ftp");

const dotenv = require("dotenv");
dotenv.config();

const habilitarEdicion = (req, res) => {
  req.session.editar = true;
  return res.redirect("/dashboard/user");
};

const subirAvatar = async (stream, ruta) => {
  const ftpClient = new Client();
  ftpClient.ftp.verbose = true;
  await ftpClient
    .access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: true,
    });
    
    await ftpClient.uploadFrom(stream, ruta)
    .then(() => {
      console.log("Archivo subido exitosamente al servidor FTP");
    })
    .catch((err) => {
      console.error("Error al subir archivo al servidor FTP:", err);
      res.status(500).send("Error interno al subir archivo al servidor FTP.");
    });
};

const deleteFile = async (filePath) => {
  const ftpClient = new Client();
  ftpClient.ftp.verbose = true;
  try {
    await ftpClient.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: true,
    });

    console.log("Conectado al servidor FTP");

    await ftpClient.remove(filePath);
    console.log("Archivo borrado en el servidor FTP");
  } catch (err) {
    console.error("Error al borrar el archivo en el servidor FTP:", err);
  }
};

// controlador de registro
const userRegister = async (req, res) => {
  const { username, email, password } = req.body;
  let image = req.file;

  if (image === undefined) {
    image =
      "https://isobarscience.com/wp-content/uploads/2020/09/default-profile-picture1.jpg";
    req.session.ruta = image;
  } else {
    const stream = Readable.from(image.buffer);

    const archivo =
      image.fieldname + "-" + Date.now() + path.extname(image.originalname);

    const ruta = process.env.FTP_PATH + archivo;
    await subirAvatar(stream, ruta);
    req.session.ruta = process.env.FTP_PATH_WWW + archivo;
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

  req.session.save((err) => {
    if (err) {
      console.error("Error al guardar la sesión:", err);
      return res.status(500).send("Error al cerrar sesión");
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("Error al destruir la sesión:", err);
        return res.status(500).send("Error al cerrar sesión");
      }

      return res.redirect("/login"); // Redirige al usuario a la página de login
    });
  });
};

// controlador para modificar usuario
const userUpdate = async (req, res) => {
  delete req.session.editar;
  const { user_id } = req.params;
  let { username, password, email } = req.body;
  let image = req.file;

  let hashedPassword = "";
  const defaulImg = 'https://isobarscience.com/wp-content/uploads/2020/09/default-profile-picture1.jpg';

  try { 
    if (image === undefined)
    { req.session.ruta = req.session.url_img;}
    
    else if( image && req.session.url_img === defaulImg) 
    {
      const stream = Readable.from(image.buffer);
      const archivo = image.fieldname + "-" + Date.now() + path.extname(image.originalname);
      const ruta = process.env.FTP_PATH + archivo;
      await subirAvatar(stream, ruta);
      req.session.ruta = process.env.FTP_PATH_WWW + archivo;
    }
    else if (image) {
      //borrar la vieja
      if (req.session.url_img && typeof req.session.url_img === 'string') {
        await deleteFile("." + process.env.FTP_PATH + req.session.url_img.substring(req.session.url_img.lastIndexOf("/") + 1));
      } else {
        console.error("req.session.url_img no es una cadena válida.");
        // Aquí puedes manejar el error o registrar un mensaje de error adecuado.
      }
      //cargar nueva
      const stream = Readable.from(image.buffer);
      const archivo = image.fieldname + "-" + Date.now() + path.extname(image.originalname);
      const ruta = process.env.FTP_PATH + archivo;
      await subirAvatar(stream, ruta);
      req.session.ruta = process.env.FTP_PATH_WWW + archivo;
    }
    
    username = username === "" ? req.session.username : username;
    email = email === "" ? req.session.email : email;
    hashedPassword = password === "" ? req.session.passUser : await bcrypt.hash(password, 10);


    req.session.url_img = req.session.ruta;

    const query = "UPDATE users SET username = ?, email = ? ,password = ?, url_img = ? WHERE user_id = ?";
    const [results] = await db.query(query, [username, email, hashedPassword, req.session.ruta, user_id,]);

    req.session.username = username;
    req.session.email = email;
    req.session.url_img = req.session.ruta;
    req.session.passUser = hashedPassword;

    req.session.message = "Datos actualizado correctamente";
    return res.redirect("/dashboard/user");
  }catch(err) {
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
