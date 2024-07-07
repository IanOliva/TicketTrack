const db = require("../db/database");

//controlador para manejar los tickets

const create = (req, res) => {
  const resueltoPor = 0;
  const estate = 1;
  const idUsuario = req.session.userId;
  const { motivo, descripcion, prioridad } = req.body;
  const query =
    "INSERT INTO tickets ( motivo, descripcion, idUsuario, prioridad, resueltoPor, estate ) VALUES (?, ?, ?, ?, ?, ?)";
  db.execute(
    query,
    [motivo, descripcion, idUsuario, prioridad, resueltoPor, estate],
    (err, results) => {
      if (err) {
        console.error("Error al crear el ticket:", err);
        return res.status(500).send("Error al crear el ticket");
      }
      req.session.message = "Ticket creado correctamente";
      return res.redirect("/dashboard/user");
    }
  );
};

const update = (req, res) => {
  const { id_ticket } = req.params;
  const aceptar = '2';
  let query;

  query = "Update tickets set estate = ? WHERE id_ticket = ?";

  db.execute(query, [aceptar, id_ticket, ] , (err, results) => {
    if (err) {
      console.error("Error al aceptar el ticket:", err);
      return res.status(500).send("Error al aceptar el ticket");
    }
    req.session.message = "Ticket Aceptado";
    return res.redirect("/dashboard/dash-tickets");

  });
};

const borrar = (req, res) => {
  const userId = req.userData.userId;
  const is_admin = req.userData.is_admin;

  const { id_ticket } = req.params;

  const queryAdmin = "DELETE FROM tickets where id_ticket = ? ";
  const queryUser = "DELETE FROM tickets where id_ticket = ?  AND idUsuario = ?";
  const query = is_admin ? queryAdmin : queryUser;

  const queryParams = is_admin ? [id_ticket] : [id_ticket, userId];

  db.execute(query, queryParams , (err, results) => {
    if (err) {
      console.error("Error al borrar el ticket:", err);
      return res.status(500).send("Error al borrar el ticket");
    }
    req.session.message = "Ticket borrado correctamente";
    
    if (is_admin === "true") {
      return res.redirect("/dashboard/dash-tickets");
    } else {
      return res.redirect("/dashboard/user");
    }

  });
};

module.exports = {
  create,
  update,
  borrar,
};
