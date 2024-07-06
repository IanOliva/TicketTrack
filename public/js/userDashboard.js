const prioridadPorID = {
  1: { palabra: "baja", color: 'primary' }, // Verde
  2: { palabra: "media", color: 'warning' }, // Naranja
  3: { palabra: "alta", color: 'danger' }, // Rojo
};

const estadoTicketID = {
  1: { palabra: "En Espera", color: "#808080" }, // Gris
  2: { palabra: "Resuelto", color: "#008000" }, // Verde
  3: { palabra: "Cancelado", color: "#ff0000" }, // Naranja
  4: { palabra: "Terminado", color: "#00e7ff" }, // Cian
};

//funcion para Cargar "section/ticket-detail.html" con la info del ticket seleccionado
// function cargarTicketSeleccionado(lista) {
//   var urlParams = new URLSearchParams(window.location.search);
//   var ticketId = urlParams.get("idTicket");
//   var ticket = lista.find((t) => t.id_Ticket == ticketId);

//   if (ticket) {
//     var ticketDetails = document.getElementById("details");
//     var ticketArmado = `
//             <div class="detail-card">
//               <div class="detail-card-header">
//                   <div class="cajaAlineadoraCabecera">
//                       <p style="text-transform: capitalize;"><strong>Prioridad</strong></p>
//                       ${prioridadPorID[ticket.prioridad].palabra}
//                   </div>
//                   <div class="cajaAlineadoraCabecera">
//                       <p><strong>Ticket</strong></p>
//                       Nº ${ticket.id_Ticket}
//                   </div>
//                   <div class="cajaAlineadoraCabecera">
//                       <p><strong>Usuario</strong></p>
//                       ${ticket.user}
//                   </div>
//               </div>
//               <hr class="border border-primary border-3 opacity-75 w-10" style="margin-bottom:0!important;">
//               <div class="fechaCarga"><p>Creado ${formatearFecha(
//                 ticket.fechaOpen
//               )}</p></div>
//               <div class="detail-card-body">
//                   <h5><strong>${ticket.motivo}</strong></h5>
//                   <p><strong>Detalle</strong><br> ${ticket.descripcion}</p>
//                   <hr class="border border-primary border-3 opacity-75 w-10">
//                   <div class="botonesAcciones">
//                       <button onClick=window.history.back(); type="button" class="btn btn-dark">Volver</button>
//                       <aside>
//                           <button type="button" class="btn btn-success">Resolver</button>
//                           <button type="button" class="btn btn-danger">Cancelar</button>
//                       </aside>
//                   </div>
//               </div>
//             </div>`;
//     ticketDetails.innerHTML = ticketArmado;
//   }
// }

// function mostrarTicketCreadoRecien(paqueteDatos) {
//   const divDatos = document.getElementById("modalPadre");

//   divDatos.innerHTML = `<div class="card mb-3" style="width: 500px;user-select: none;">
//     <div class="row g-0">
//       <div class="col-md-4 card-dentro-del-modal">
//       </div>
//       <div class="col-md-8" style="display: flex !important;
//       justify-content: center !important;
//       align-items: center !important;" >
//         <div class="card-body">
//           <h5 class="card-title">😁Ticket Enviado Exitosamente!</h5>
//           <p class="card-text">Gracias ${paqueteDatos.user} por confiar en nosotros!</p>
//           <p class="card-text"><small class="text-body-secondary">En los proximos dias recibiras noticias de tu ticket</small></p>
//         </div>
//       </div>
//     </div>
//   </div>`; // Mostrar los datos en el div

//   // Cerrar el div después de 4 segundos
//   setTimeout(function () {
//     divDatos.style.display = "none";

//     // Simular envío de formulario y redirigir a tickets.html
//     window.location.href = "/dashboard/user";
//   }, 4000);
// }

document.addEventListener("DOMContentLoaded", () => {
  const botonFalso = document.querySelector(".addTicketButton");
  const abrirModal = document.getElementById("botonModal");

  botonFalso.addEventListener("click", () => {
    abrirModal.click();
  });
});
