const db = require("../db/database");

//controlador para manejar los tickets

const create = (req, res) => {
  const resueltoPor = 0;
  const estate = 1;
  const { motivo, descripcion, fechaOpen, idUsuario, prioridad } = req.body;
  const query =
    "INSERT INTO tickets ( motivo, descripcion, fechaOpen, idUsuario, prioridad, resueltoPor,estate ) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.execute(
    query,
    [motivo, descripcion, fechaOpen, idUsuario, prioridad, resueltoPor, estate],
    (err, results) => {
      if (err) {
        console.error("Error al crear el ticket:", err);
        return res.status(500).send("Error al crear el ticket");
      }
      req.session.message = "Ticket creado correctamente";
      return res.redirect("/user");
    }
  );
};

const borrar = (req, res) => {
  const { id_ticket } = req.params;
  const query = "DELETE FROM tickets where id_ticket = ? ";
  db.execute(query, [id_ticket], (err, results) => {
    if (err) {
      console.error("Error al borrar el ticket:", err);
      return res.status(500).send("Error al borrar el ticket");
    }
    req.session.message = "Ticket borrado correctamente";
    return res.redirect("/user");
  });
};

module.exports = {
  create,
  borrar,
};
