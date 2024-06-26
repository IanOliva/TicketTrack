const jwt = require('jsonwebtoken');

// Middleware para la autentificación, si al ingresar al sistema no hay token, 
// se redirije a la ruta de login, de lo contrario, se validará el token y se le redirigira a la ruta dashboard

function authenticateToken(req, res, next) {
  const token = req.cookies.token; // Extrae el token de las cookies

  if (!token) {
       // No hay token, redirije a la ruta de login
    return res.redirect('/login');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.redirect('/login'); // Token inválido
    }
    req.user = user; // Almacena la información del usuario decodificado en req.user
    next(); // Continúa con el siguiente middleware o controlador
  });
}

module.exports = { authenticateToken };
