const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const { authenticateToken } = require('../middlewares/auth');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

// Configurar la conexión a MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL users');
});



// Ruta de registro
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.execute(query, [username, email, hashedPassword], (err, results) => {
    if (err) {
      console.error('Error durante el registro del usuario:', err);
      return res.status(500).send('Error durante el registro del usuario');
    }
    res.status(201).send('Usuario registrado');
  });
});

// Ruta de inicio de sesión
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  db.execute(query, [email], async (err, results) => {
    if (err) {
      console.error('Error durante el inicio de sesión:', err);
      return res.status(500).send('Error durante el inicio de sesión');
    }
    if (results.length === 0) {
      return res.status(401).send('Nombre de usuario o contraseña incorrectos');
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send('Nombre de usuario o contraseña incorrectos');
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.cookie('token', token, { httpOnly: true }); // Configura la cookie con el token
    res.redirect('/dashboard'); // Redirige al dashboard
  });
});


// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
  res.clearCookie('token'); // Eliminar la cookie del token
  res.redirect('/'); // Redirigir al usuario a la página principal
});


module.exports = router;
