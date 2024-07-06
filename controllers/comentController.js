const db = require("../db/database");


const getAllComments = (req, res) => {
    const query = "SELECT * FROM comments";

    try {
        db.query(query, (err, results) => {
            if (err) {
                console.error("Error al obtener los comentarios:", err);
                return res.status(500).send("Error al obtener los comentarios");
            }
            //reemplazar el render donde vaya a estar la vista
            // res.render('about-us', { title: 'About Us', css: '/assets/css/about-us.css', session: req.session, comments: results });
        });
    } catch (error) {
        console.error("Error al obtener los comentarios:", error);
        res.status(500).send("Error al obtener los comentarios");
    }
}

const getLastComments = (req, res) => {

    const query = "SELECT * FROM comments ORDER BY comment_id DESC LIMIT 5";

    try {
        db.query(query, (err, results) => {
            if (err) {
                console.error("Error al obtener los comentarios:", err);
                return res.status(500).send("Error al obtener los comentarios");
            }
            res.render('about-us', { title: 'About Us', css: '/assets/css/about-us.css', session: req.session, comments: results });
        });
    } catch (error) {
        console.error("Error al obtener los comentarios:", error);
        res.status(500).send("Error al obtener los comentarios");
    }
}

const createComment = (req, res) => {
    const { name, gridRadios,rating, text } = req.body;
    const query = "INSERT INTO comments (name, genIcon,rating, text) VALUES (?, ?, ?, ?)";

    try {
        db.query(query, [name, gridRadios,rating, text], (err, results) => {
            if (err) {
                console.error("Error al crear el comentario:", err);
                return res.status(500).send("Error al crear el comentario");
            }
            res.redirect('/api-comments/about-us');
        });
    } catch (error) {
        console.error("Error al crear el comentario:", error);
        res.status(500).send("Error al crear el comentario");
    }
}

const borrar = (req, res) => {
    const userId = req.userData.userId;
    const is_admin = req.userData.is_admin;
  
    const { comment_id } = req.params;
  
    const query = "DELETE FROM comments where comment_id = ? ";
  
    db.execute(query, [comment_id] , (err, results) => {
      if (err) {
        console.error("Error al borrar el ticket:", err);
        return res.status(500).send("Error al borrar el ticket");
      }
      req.session.message = "Ticket borrado correctamente";
      
      if (is_admin === "true") {
        res.redirect("/dashboard/dash-comments");
      } else {
        res.redirect("/api-user/logout");
      }
  
    });
  };

module.exports = { getLastComments , createComment , getAllComments, borrar }