const db = require("../db/database");

const dashAdmin = (req, res) => {
  const userId = req.userData.userId;
  const username =  req.userData.username;
  const urlImg =  req.userData.urlImg;

  const queryUsers = "SELECT * FROM users WHERE user_id = ?";

  db.query(queryUsers, [userId], (err, dataPersonal) => {
    if (err) {
      console.error("Error al obtener registros:", err);
      return res.status(500).send("Error al obtener registros");
    }

    const queryTickets = "SELECT * FROM tickets WHERE idUsuario = ?";

    db.query(queryTickets, [userId], (err, ticketsUsuario) => {
      if (err) {
        console.error("Error al obtener tickets:", err);
        return res.status(500).send("Error al obtener tickets");
      }

      const queryResolvedTickets =
        "SELECT count(*) as total FROM tickets WHERE resueltoPor = ?";

      db.query(queryResolvedTickets, [userId], (err, ticketsResueltos) => {
        if (err) {
          console.error("Error al obtener tickets resueltos:", err);
          return res.status(500).send("Error al obtener tickets resueltos");
        }

        const data = {
          title: "Dashboard Home",
          datosUsuario: dataPersonal[0],
          ticketsUsuario: ticketsUsuario,
          ticketsResueltos: ticketsResueltos[0],
        };

        res.render("dashboard", { username : [username] , urlImg : [urlImg] , content: "components/dashboard/dash-admin", data });
      });
    });
  });
};

const dashHome = (req, res) => {
  const userId = req.userData.userId;
  const username =  req.userData.username;
  const urlImg =  req.userData.urlImg;
  
  res.render("dashboard", {  username : [username] , urlImg : [urlImg] , content: "components/dashboard/dash-home" });
};

module.exports = {
  dashAdmin,
  dashHome,
};
