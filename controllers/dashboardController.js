const db = require("../db/database");

const dashUser = (req, res) => {
  const userId = req.userData.userId;

  const queryUser = "SELECT * FROM tickets WHERE idUsuario = ? ";

  db.query(queryUser, [userId], (err, userTicketsResults) => {
    if (err) {
      console.error("Error al obtener tickets:", err);
      return res.status(500).send("Error al obtener datos del usuario");
    }

    const data = {
      tickets: userTicketsResults,
    };

    res.render('user-dashboard',{ title: 'Usuario', css: '/assets/css/user-dashboard.css', session: req.session , data: data, message : req.session.message,});
  });
};

const dashAdmin = (req, res) => {
  const userId = req.userData.userId;
  const username = req.userData.username;
  const urlImg = req.userData.urlImg;
  const mensaje = req.userData.message;

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

        res.render("dashboard", {
          username: [username],
          urlImg: [urlImg],
          message: [mensaje],
          content: "components/dashboard/dash-admin",
          data,
        });
      });
    });
  });
};

const dashHome = (req, res) => {
  const userId = req.userData.userId;
  const username = req.userData.username;
  const urlImg = req.userData.urlImg;
  const mensaje = req.userData.mensajitoQWEQWE;

  const queryTickets = "SELECT * FROM tickets";
  const queryCount = "SELECT COUNT(*) AS totalTickets FROM tickets";
  const queryWaiting =
    "SELECT COUNT(*) AS totalWaiting FROM tickets WHERE estate = 1"; //en espera
  const queryResolved =
    "SELECT COUNT(*) AS totalResolved FROM tickets WHERE estate = 2"; // resueltos

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
          console.error("Error al obtener la suma de tickets en espera:", err);
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

          const calcularDiasEntreFechas = (fechaInicio, fechaCierre) => {
            // Parsear las fechas asegurando que estén en el formato adecuado
            const inicio = new Date(fechaInicio);
            const cierre = new Date(fechaCierre);

            // Verificar si las fechas son válidas
            if (isNaN(inicio) || isNaN(cierre)) {
              return 0; // Si alguna fecha no es válida, retornar 0 días
            }

            const diffTime = Math.abs(cierre - inicio);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return diffDays;
          };

          // Calcula los días para cada ticket y suma para promedio
          let totalDiasTranscurridos = 0;
          ticketResults.forEach((ticket) => {
            if (ticket.estate === 2) {
              // Verificar estado igual a 2 (resuelto)
              const diasTranscurridos = calcularDiasEntreFechas(
                ticket.fechaOpen,
                ticket.fechaUpdate
              );

              totalDiasTranscurridos += diasTranscurridos;
            }
          });

          // Calcula el promedio de días transcurridos
          const totalTickets = ticketResults.filter(
            (a) => a.estate === 2
          ).length; // 2 resuelto

          const promedioDiasTranscurridos =
            totalDiasTranscurridos / totalTickets;

          const mostOlder = (lista) => {
            let actual = new Date();
            lista.forEach((t) => {
              if (t.estate === 1 && t.fechaOpen < actual) {
                // 1 en espera
                actual = t.fechaOpen;
              }
            });
            return actual;
          };

          const calcularDiasAtraso = (fechaInicio) => {
            // Parsear las fechas asegurando que estén en el formato adecuado
            const inicio = new Date(fechaInicio);
            const cantDias = calcularDiasEntreFechas(inicio, new Date());

            return cantDias;
          };

          const data = {
            totalTickets: countResults[0].totalTickets,
            totalWaiting: waitingResults[0].totalWaiting,
            totalResolved: resolvedResults[0].totalResolved,
            promedio: Math.ceil(promedioDiasTranscurridos),
            diasAtraso: calcularDiasAtraso(mostOlder(ticketResults)),
          };

          res.render("dashboard", {
            username: [username],
            urlImg: [urlImg],
            message: [mensaje],
            content: "components/dashboard/dash-home",
            data,
          });
        });
      });
    });
  });
};

const dashTickets = (req, res) => {
  const userId = req.userData.userId;
  const username = req.userData.username;
  const urlImg = req.userData.urlImg;
  const mensaje = req.userData.mensajitoQWEQWE;

  const queryTickets = "SELECT * FROM tickets";

  db.query(queryTickets, (err, ticketResults) => {
    if (err) {
      console.error("Error al obtener registros:", err);
      return res.status(500).send("Error al obtener registros");
    }

    const data = {
      tickets: ticketResults,
    };

    res.render("dashboard", {
      username: [username],
      urlImg: [urlImg],
      message: [mensaje],
      content: "components/dashboard/dash-tickets",
      data,
    });
  });
};

const dashAllUsers = (req, res) => {
  const userId = req.userData.userId;
  const username = req.userData.username;
  const urlImg = req.userData.urlImg;
  const mensaje = req.userData.mensajitoQWEQWE;

  const queryUsers =
    "SELECT *, (select count(*) from tickets where tickets.idUsuario = users.user_id)as cantTickets FROM users";

  db.query(queryUsers, (err, usersResults) => {
    if (err) {
      console.error("Error al obtener registros:", err);
      return res.status(500).send("Error al obtener registros");
    }
    const data = {
      users: usersResults,
    };

    res.render("dashboard", {
      username: [username],
      urlImg: [urlImg],
      message: [mensaje],
      content: "components/dashboard/dash-users",
      data,
    });
  });
};

const dashComments = (req, res) => {
  const userId = req.userData.userId;
  const username = req.userData.username;
  const urlImg = req.userData.urlImg;
  const mensaje = req.userData.mensajitoQWEQWE;

  const queryComments = "SELECT * FROM comments";

  db.query(queryComments, (err, commentsResults) => {
    if (err) {
      console.error("Error al obtener registros:", err);
      return res.status(500).send("Error al obtener registros");
    }
    const data = {
      comments: commentsResults,
    };

    res.render("dashboard", {
      username: [username],
      urlImg: [urlImg],
      message: [mensaje],
      content: "components/dashboard/dash-comments",
      data,
    });
  });
};

module.exports = {
  dashUser,
  dashAdmin,
  dashHome,
  dashTickets,
  dashAllUsers,
  dashComments,
};
