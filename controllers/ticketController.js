const db = require("../db/database");

const getAdminDashboard = (req, res) => {
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
            if (ticket.estate === 2) { // Verificar estado igual a 2 (resuelto)
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

          const promedioDiasTranscurridos = totalDiasTranscurridos / totalTickets;

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

          res.render("components/dash-home", { data })
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

const getAllTickets = (req, res) => {
  const queryTickets = "SELECT * FROM tickets";
  
  db.query(queryTickets, (err, ticketResults) => {
    if (err) {
      console.error("Error al obtener registros:", err);
      return res.status(500).send("Error al obtener registros");
    }

    const data = {
      tickets: ticketResults,
    };

    // Renderiza la vista 'components/dash-tickets.ejs' y pasa 'data' como dato
    res.render("components/dash-tickets", { data });
  });
};

module.exports = {
  getAdminDashboard,
  getUserDashboard,
  getAllTickets,
};
