const express = require('express');
const path = require('path');
const ticketRoutes = require('../routes/ticketsRoutes');
const userRoutes = require('../routes/usersRoutes');
const { authenticateToken } = require('../middlewares/auth');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Configurar EJS como el motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middleware para servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));

// Usar las rutas de la API de tickets
app.use('/api-tickets', ticketRoutes);

// Usar las rutas de la API de usuarios
app.use('/api-users', userRoutes);

// Ruta para servir la vista home.ejs como principal desde la carpeta views
app.get('/', (req, res) => {
  res.render('home', { title: 'Home', css: '/assets/css/home.css' });
});

// Ruta para la vista about-us.ejs
app.get('/about-us', (req, res) => {
  res.render('about-us', { title: 'About Us', css: '/assets/css/about-us.css' });
});

// Ruta para servir la vista dashboard.ejs desde la carpeta views, solo si está autenticado
app.get('/dashboard', authenticateToken, (req, res) => {
  res.render('dashboard', { title: 'Dashboard', css: '/assets/css/dashboard.css' });
});

// Ruta para servir la vista user-dashboard.ejs desde la carpeta views, solo si está autenticado
app.get('/user-dashboard', authenticateToken, (req, res) => {
  res.render('user-dashboard', { title: 'User Dashboard' , css: '/assets/css/user-dashboard.css' });
});

// Ruta para servir la vista login.ejs desde la carpeta views || sin css porque esta hecho con bootstrap
app.get('/login', (req, res) => {
  res.render('login', { title: 'Login' , css: '' });
});

// Ruta para servir la vista register.ejs desde la carpeta views || sin css porque esta hecho con bootstrap
app.get('/register', (req, res) => {
  res.render('register', { title: 'Register' , css: '' });
});

// Ruta para servir la vista support.ejs desde la carpeta views
app.get('/faqs', (req, res) => {
  res.render('faqs', { title: 'Faqs', css: '/assets/css/faqs.css' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
