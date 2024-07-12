const db = require("../db/database");

//funciones que vamos a usar en la parte de dash-home
// const calcularDiasEntreFechas = (fechaInicio, fechaCierre) => {
//   // Parsear las fechas asegurando que estén en el formato adecuado
//   const inicio = new Date(fechaInicio);
//   const cierre = new Date(fechaCierre);

//   // Verificar si las fechas son válidas
//   if (isNaN(inicio) || isNaN(cierre)) {
//     return 0; // Si alguna fecha no es válida, retornar 0 días
//   }

//   const diffTime = Math.abs(cierre - inicio);
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//   return diffDays;
// };

//saber el mas viejo
// const mostOlder = (lista) => {
//   let actual = new Date();
//   if(lista.length > 0) {
//     lista.forEach((t) => {
//       if (t.estate === 1 && t.fechaOpen < actual) {
//         // 1 en espera
//         actual = t.fechaOpen;
//       }
//     });
//     return actual;
//   }
//   else{
//     return 0;
//   }
// };

// const calcularDiasAtraso = (fechaInicio) => {
//   // Parsear las fechas asegurando que estén en el formato adecuado
//   const inicio = new Date(fechaInicio);
//   const cantDias = calcularDiasEntreFechas(inicio, new Date());

//   return cantDias;
// };

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

//Renders

const dashUser = async (req, res) => {
  const userId = req.userData.userId;

  const queryTicketsUser = "SELECT * FROM tickets WHERE idUsuario = ? ";
  const queryUser = "SELECT * FROM users WHERE user_id = ? ";

  try {
    const userTicketsResults = await db.query(queryTicketsUser, [userId]);
    const userData = await db.query(queryUser, [userId]);
    
    const data = {
      tickets: userTicketsResults[0],
      user: userData[0][0],
    };    

    return res.render("user-dashboard", {
      title: "Usuario",
      css: "/assets/css/user-dashboard.css",
      session: req.session,
      message: req.session.message,
      data: data,
    });

  } catch (err) {
    console.error("Error al obtener tickets:", err);
    return res.status(500).send("Error al obtener datos del usuario");
  }
};

const dashAdmin = async (req, res) => {
  const userId = req.userData.userId;
  const username = req.userData.username;
  const urlImg = req.userData.urlImg;
  const mensaje = req.userData.message;

  const queryUser = "SELECT * FROM users WHERE user_id = ?";
  const queryTickets = "SELECT * FROM tickets WHERE idUsuario = ?";
  const queryResolvedTickets =
    "SELECT count(*) as total FROM tickets WHERE resueltoPor = ?";

  try {
    const dataPersonal = await db.query(queryUser, [userId]);
    const ticketsUsuario = await db.query(queryTickets, [userId]);
    const ticketsResueltos = await db.query(queryResolvedTickets, [userId]);

    const data = {
      title: "Dashboard Home",
      datosUsuario: dataPersonal[0][0],
      ticketsUsuario: ticketsUsuario[0],
      ticketsResueltos: ticketsResueltos[0][0],
    };

    return res.render("dashboard", {
      username: [username],
      urlImg: [urlImg],
      message: [mensaje],
      content: "components/dashboard/dash-admin",
      data,
    });
  } catch (err) {
    console.error("Error al obtener registros:", err);
    return res.status(500).send("Error al obtener registros");
  }
};

const dashHome = async (req, res) => {
  const username = req.userData.username;
  const urlImg = req.userData.urlImg;
  const mensaje = req.userData.message;

  //variables para calcular abajo
  let totalTickets = 0;
  // promedioDiasTranscurridos = 0,
  //totalDiasTranscurridos = 0,
  //atrasados = 0;

  const queryTickets = "SELECT * FROM tickets";
  const queryCount = "SELECT COUNT(*) AS totalTickets FROM tickets";
  const queryWaiting =
    "SELECT COUNT(*) AS totalWaiting FROM tickets WHERE estate = 1"; //en espera
  const queryResolved =
    "SELECT COUNT(*) AS totalResolved FROM tickets WHERE estate = 2"; // resueltos

  const queryCountAdmin =
    "SELECT COUNT(*) AS totalAdmin FROM users WHERE is_admin = 'true'";
  const queryCountUsers =
    "SELECT COUNT(*) AS totalUsers FROM users WHERE is_admin = 'false'";
  const queryCountComments = "SELECT COUNT(*) AS totalComments FROM comments";

  try {
    const ticketResults = await db.query(queryTickets);
    const countResults = await db.query(queryCount);
    const waitingResults = await db.query(queryWaiting);
    const resolvedResults = await db.query(queryResolved);
    const countAdmin = await db.query(queryCountAdmin);
    const countUsers = await db.query(queryCountUsers);
    const countComments = await db.query(queryCountComments);

    // if (ticketResults[0].length > 0) {
    //   ticketResults[0].forEach((ticket) => {
    //     if (ticket.estate === 2) {
    //       // Verificar estado igual a 2 (resuelto)
    //       const diasTranscurridos = calcularDiasEntreFechas(
    //         ticket.fechaOpen,
    //         ticket.fechaUpdate
    //       );

    //       totalDiasTranscurridos += diasTranscurridos;
    //     }
    //     atrasados = calcularDiasAtraso(mostOlder(ticketResults[0][0]));
    //   });

    //   // Calcula el promedio de días transcurridos
    //   totalTickets = ticketResults[0].filter((a) => a.estate === 2).length; // 2 resuelto
    //   promedioDiasTranscurridos = totalDiasTranscurridos / totalTickets;
    // }

    const data = {
      totalTickets: countResults[0][0].totalTickets,
      totalWaiting: waitingResults[0][0].totalWaiting,
      totalResolved: resolvedResults[0][0].totalResolved,
      //promedio: Math.ceil(promedioDiasTranscurridos),
      // diasAtraso: atrasados,
      totalAdmin: countAdmin[0][0].totalAdmin,
      totalUsers: countUsers[0][0].totalUsers,
      totalComments: countComments[0][0].totalComments,
    };

    return res.render("dashboard", {
      username: [username],
      urlImg: [urlImg],
      message: [mensaje],
      content: "components/dashboard/dash-home",
      data,
    });
  } catch (err) {
    console.error("Error al obtener registros:", err);
    return res.status(500).send("Error al obtener registros");
  }
};

const dashTickets = async (req, res) => {
  const username = req.userData.username;
  const urlImg = req.userData.urlImg;
  const mensaje = req.userData.mensajito;

  const queryTickets =
    "SELECT * FROM tickets t left join users u on t.idUsuario = u.user_id";

  try {
    const ticketResults = await db.query(queryTickets);

    const data = {
      tickets: ticketResults[0],
    };

    return res.render("dashboard", {
      username: [username],
      urlImg: [urlImg],
      message: [mensaje],
      content: "components/dashboard/dash-tickets",
      data,
    });
  } catch (err) {
    console.error("Error al obtener registros:", err);
    return res.status(500).send("Error al obtener registros");
  }
};

const dashAllUsers = async (req, res) => {
  const username = req.userData.username;
  const urlImg = req.userData.urlImg;
  const mensaje = req.userData.mensajitoQWEQWE;

  const queryUsers =
    "SELECT *, (select count(*) from tickets where tickets.idUsuario = users.user_id)as cantTickets FROM users";

  try {
    const usersResults = await db.query(queryUsers);

    const data = {
      users: usersResults[0],
    };

    return res.render("dashboard", {
      username: [username],
      urlImg: [urlImg],
      message: [mensaje],
      content: "components/dashboard/dash-users",
      data,
    });
  } catch (err) {
    console.error("Error al obtener registros:", err);
    return res.status(500).send("Error al obtener registros");
  }
};

const dashComments = async (req, res) => {
  const userId = req.userData.userId;
  const username = req.userData.username;
  const urlImg = req.userData.urlImg;
  const mensaje = req.userData.mensajitoQWEQWE;

  const queryComments = "SELECT * FROM comments";

  try {
    const commentsResults = await db.query(queryComments);
    const data = {
      comments: commentsResults[0],
    };

    return res.render("dashboard", {
      username: [username],
      urlImg: [urlImg],
      message: [mensaje],
      content: "components/dashboard/dash-comments",
      data,
    });
  } catch (err) {
    console.error("Error al obtener registros:", err);
    return res.status(500).send("Error al obtener registros");
  }
};

module.exports = {
  dashUser,
  dashAdmin,
  dashHome,
  dashTickets,
  dashAllUsers,
  dashComments,
};
