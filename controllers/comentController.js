const db = require("../db/database");

const getAllComments = async (req, res) => {
  const query = "SELECT * FROM comments";

  try {
    const [results] = await db.query(query);
    //res.render('about-us', { title: 'About Us', css: './assets/css/about-us.css', session: req.session, comments: results });
    // db.query(query, (err, results) => {
    //     if (err) {
    //         console.error("Error al obtener los comentarios:", err);
    //         return res.status(500).send("Error al obtener los comentarios");
    //     }
    // });
  } catch (error) {
    console.error("Error al obtener los comentarios:", error);
    return res.status(500).send("Error al obtener los comentarios");
  }
};

const getLastComments = async (req, res) => {
  const query = "SELECT * FROM comments ORDER BY comment_id DESC LIMIT 5";

  try {
    const [results] = await db.query(query);
    return res.render("about-us", {
      title: "About Us",
      css: "/assets/css/about-us.css",
      session: req.session,
      comments: results,
    });
  } catch (error) {
    console.error("Error al obtener los comentarios:", error);
    return res.status(500).send("Error al obtener los comentarios");
  }
};

const createComment = async (req, res) => {
  const { name, gridRadios, rating, text } = req.body;
  const query =
    "INSERT INTO comments (name, genIcon,rating, text) VALUES (?, ?, ?, ?)";

  try {
    const [results] = await db.query(query, [name, gridRadios, rating, text]);
    return res.redirect("/api-comments/about-us");
  } catch (error) {
    console.error("Error al crear el comentario:", error);
    return res.status(500).send("Error al crear el comentario");
  }
};

const borrar = async (req, res) => {
  const userId = req.userData.userId;
  const is_admin = req.userData.is_admin;
  const { comment_id } = req.params;

  const query = "DELETE FROM comments where comment_id = ? ";

  try {
    const [results] = await db.query(query, [comment_id]);
    req.session.message = "Ticket borrado correctamente";

    if (is_admin === "true") {
      return res.redirect("/dashboard/dash-comments");
    } else {
      return res.redirect("/api-user/logout");
    }
  } catch (err) {
    console.error("Error al borrar el ticket:", err);
    return res.status(500).send("Error al borrar el ticket");
  }
};

module.exports = { getLastComments, createComment, getAllComments, borrar };
