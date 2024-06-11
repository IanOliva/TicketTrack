const jwt = require('jsonwebtoken');

// Middleware para la autentificación, si al ingresar al sistema no hay token, 
// se redirije a la ruta de login, de lo contrario, se validará el token y se le redirigira a la ruta dashboard

function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/login');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.redirect('/login');
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };
