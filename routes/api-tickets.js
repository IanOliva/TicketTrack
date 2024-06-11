const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

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
    console.log('Conectado a la base de datos MySQL tickets');
});

// Ruta para obtener registros de la base de datos y mostrarlos en una vista EJS
router.get('/registros', (req, res) => {
    const query = 'SELECT * FROM tickets';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error al obtener registros:', err);
        res.status(500).send('Error al obtener registros');
        return;
      } else {
        res.json(results);
        // Devuelve los datos obtenidos en formato JSON para consumirlos en el front con un fetch en el js del dashboard
      }
    });
  });


module.exports = router;