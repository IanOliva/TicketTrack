const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const app = express();
const PORT = process.env.PORT || 3000;

// Configurar la conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ticket_track'
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Configurar EJS como el motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para servir la vista home.ejs como principal desde la carpeta views
app.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

// Ruta para la vista about-us.ejs
app.get('/about-us', (req, res) => {
  res.render('about-us', { title: 'About Us' });
});

// Ruta para servir la vista dashboard.ejs desde la carpeta views
app.get('/dashboard', (req, res) => {
  res.render('dashboard', { title: 'Dashboard' });
});

// Ruta para servir la vista support.ejs desde la carpeta views
app.get('/support', (req, res) => {
  res.render('support', { title: 'Support' });
});

// Ruta para obtener registros de la base de datos y mostrarlos en una vista EJS
app.get('/api/registros', (req, res) => {
  const query = 'SELECT * FROM tickets';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener registros:', err);
      res.status(500).send('Error al obtener registros');
      return;
    }else{
    
    res.json(results);
    //devuelve los datos obtenidos en formato json para consumirlos en el front con un fetch en el js del dashboard
  }
    
  });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
