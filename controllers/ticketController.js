const db = require("../db/database");

//controlador para manejar los tickets

const create = async (req, res) => {
  const resueltoPor = 0;
  const estate = 1;
  const idUsuario = req.session.userId;
  const { motivo, descripcion, prioridad } = req.body;
  const query =
    "INSERT INTO tickets ( motivo, descripcion, idUsuario, prioridad, resueltoPor, estate ) VALUES (?, ?, ?, ?, ?, ?)";

  try {
    await db.query(query, [
      motivo,
      descripcion,
      idUsuario,
      prioridad,
      resueltoPor,
      estate,
    ]);

    req.session.message = "Ticket creado correctamente";
    return res.redirect("/dashboard/user");
  } catch (err) {
    console.error("Error al crear el ticket:", err);
    return res.status(500).send("Error al crear el ticket");
  }
};

const update = async (req, res) => {
  const { id_ticket } = req.params;
  const aceptar = "2";
  let query;

  query = "Update tickets set estate = ? WHERE id_ticket = ?";

  try {
    const [results] = await db.query(query, [aceptar, id_ticket]);
    req.session.message = "Ticket Aceptado";
    return res.redirect("/dashboard/dash-tickets");
  } catch (err) {
    console.error("Error al aceptar el ticket:", err);
    return res.status(500).send("Error al aceptar el ticket");
  }
};

const borrar = async (req, res) => {
  const userId = req.session.userId;

  const { id_ticket } = req.params;

  const queryAdmin = "DELETE FROM tickets where id_ticket = ? ";
  const queryUser =
    "DELETE FROM tickets where id_ticket = ?  AND idUsuario = ?";
  const query = req.session.is_admin ? queryAdmin : queryUser;
  const queryParams = req.session.is_admin ? [id_ticket] : [id_ticket, userId];

  try {
    const [results] = await db.query(query, queryParams);
    req.session.message = "Ticket borrado correctamente";
    if (req.session.is_admin === "true") {
      return res.redirect("/dashboard/dash-tickets");
    } else {
      return res.redirect("/dashboard/user");
    }
  } catch (err) {
    console.error("Error al borrar el ticket:", err);
    return res.status(500).send("Error al borrar el ticket");
  }
};

module.exports = {
  create,
  update,
  borrar,
};
