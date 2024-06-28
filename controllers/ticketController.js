const db = require("../db/database");

const getAdminDashboard = (req, res) => {
  const queryTickets = "SELECT * FROM tickets";
    const queryCount = "SELECT COUNT(*) AS totalTickets FROM tickets";
    const queryWaiting =
      "SELECT COUNT(*) AS totalWaiting FROM tickets WHERE estate = 'En espera'";
    const queryResolved =
      "SELECT COUNT(*) AS totalResolved FROM tickets WHERE estate = 'Resuelto'";

    db.query(queryTickets, (err, ticketResults) => {
      if (err) {
        console.error("Error al obtener registros:", err);
        return res.status(500).send("Error al obtener registros");
      }

      db.query(queryCount, (err, countResults) => {
        if (err) {
          console.error("Error al obtener la suma de tickets:", err);
          return res.status(500).send("Error al obtener la suma de tickets");
        }

        db.query(queryWaiting, (err, waitingResults) => {
          if (err) {
            console.error(
              "Error al obtener la suma de tickets en espera:",
              err
            );
            return res
              .status(500)
              .send("Error al obtener la suma de tickets en espera");
          }

          db.query(queryResolved, (err, resolvedResults) => {
            if (err) {
              console.error(
                "Error al obtener la suma de tickets resueltos:",
                err
              );
              return res
                .status(500)
                .send("Error al obtener la suma de tickets resueltos");
            }

            const response = {
              tickets: ticketResults,
              totalTickets: countResults[0].totalTickets,
              totalWaiting: waitingResults[0].totalWaiting,
              totalResolved: resolvedResults[0].totalResolved,
            };

            res.json(response);
          });
        });
      });
    });
};

const getUserDashboard = (req, res) => {
  const query = "SELECT * FROM tickets WHERE idUsuario = ? ";
  db.query(query, [req.user.userId], (err, results) => {
    if (err) {
      console.error("Error al obtener tickets:", err);
      return res.status(500).send("Error al obtener tickets");
    }
    res.json(results);
  });
};

module.exports = { getAdminDashboard, getUserDashboard };
// 