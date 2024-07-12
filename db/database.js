// Configurar la conexión a MySQL obteniendo los datos del archivo .env
const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

//tuvimos que usar un pool de conexiones
//porque sino nos cerraba la conexion en medio
//de las consultas en vercel.

let pool;
let db;

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 100,
  });
  db = pool.promise();
  console.log("Pool de conexiones creado exitosamente");
} catch (err) {
  console.log("Error al crear el pool de conexiones:", err);
}

module.exports = db;
