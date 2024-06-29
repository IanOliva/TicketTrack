//consumir la ruta que obtiene los tickets de la db
document.addEventListener("DOMContentLoaded", () => {

  // Función para cargar datos al hacer clic en los enlaces del menú
  function loadDashboardData(url) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const tableBody = document.getElementById("table-body");
        const totalTickets = document.getElementById("ticket-count");
        const totalWaiting = document.getElementById("waiting-count");
        const totalResolved = document.getElementById("resolved-count");
        const promedio = document.getElementById("promedio");
        const atraso = document.getElementById("atraso");

        // Vaciar el cuerpo de la tabla antes de agregar nuevas filas
        tableBody.innerHTML = "";

        // Agregar filas para cada ticket
        data.tickets.forEach((ticket) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
                      <td>${ticket.title}</td>
                      <td>${ticket.description}</td>
                      <td>${ticket.priority}</td>
                      <td>${
                        new Date(ticket.fecha).toLocaleDateString("es-AR") +
                        " " +
                        new Date(ticket.fecha).toLocaleTimeString("es-AR")
                      }</td>
                      <td>${ticket.estate}</td>
                  `;
          tableBody.appendChild(tr);
        });

        // Mostrar el total de tickets
        totalTickets.innerHTML = `${data.totalTickets}`;

        // Mostrar el total de tickets en espera
        totalWaiting.innerHTML = `${data.totalWaiting}`;

        // Mostrar el total de tickets resueltos
        totalResolved.innerHTML = `${data.totalResolved}`;

        // Mostrar el promedio de resolución
        promedio.innerHTML = `${data.promedio}`;

        // Mostrar el más antiguo
        atraso.innerHTML = `${data.diasAtraso}`;
      })
      .catch((error) => console.error("Error al obtener los datos:", error));
  }

  // // Manejar clic en los enlaces del menú
  document.querySelectorAll(".dash-links a").forEach((link) => {
    
    link.addEventListener("click", function (e) {
      e.preventDefault();
      
      const url = this.getAttribute("data-url");
      if (url === '/dash-home') {
        loadDashboardData(url); // Cargar datos al hacer clic en el enlace
      }
    });
  });

  // Cargar datos inicialmente al cargar la página
  loadDashboardData("/api-tickets/dashboard");
});
