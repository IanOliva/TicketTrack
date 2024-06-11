const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const apiUsers = require('./routes/api-users');
const apiTickets = require('./routes/api-tickets');
const { authenticateToken } = require('./middlewares/auth'); 
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

// Ruta para servir la vista dashboard.ejs desde la carpeta views, solo si está autenticado
app.get('/dashboard', authenticateToken, (req, res) => {
  res.render('dashboard', { title: 'Dashboard', user: req.user });
});

// Ruta para servir la vista login.ejs desde la carpeta views
app.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// Ruta para servir la vista support.ejs desde la carpeta views
app.get('/support', (req, res) => {
  res.render('support', { title: 'Support' });
});

// Usar las rutas de la API de usuarios
app.use('/api-users', apiUsers);

// Usar las rutas de la API de tickets
app.use('/api-tickets', apiTickets);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
