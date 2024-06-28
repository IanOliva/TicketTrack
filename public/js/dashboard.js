const body = document.querySelector("body"),
  modeToggle = body.querySelector(".mode-toggle");
sidebar = body.querySelector("nav");
sidebarToggle = body.querySelector(".sidebar-toggle");

let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark") {
  body.classList.toggle("dark");
}

let getStatus = localStorage.getItem("status");
if (getStatus && getStatus === "close") {
  sidebar.classList.toggle("close");
}

modeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  if (body.classList.contains("dark")) {
    localStorage.setItem("mode", "dark");
  } else {
    localStorage.setItem("mode", "light");
  }
});

sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
  if (sidebar.classList.contains("close")) {
    localStorage.setItem("status", "close");
  } else {
    localStorage.setItem("status", "open");
  }
});

//consumir la ruta que obtiene los tickets de la db
document.addEventListener("DOMContentLoaded", () => {
  fetch("/api-tickets/dashboard")
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.getElementById("table-body");
      const totalTickets = document.getElementById("ticket-count");
      const totalWaiting = document.getElementById("waiting-count");
      const totalResolved = document.getElementById("resolved-count");

      // Vaciar el cuerpo de la tabla antes de agregar nuevas filas
      tableBody.innerHTML = "";

      // Agregar filas para cada ticket
      data.tickets.forEach((ticket) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${ticket.title}</td>
        <td>${ticket.description}</td>
        <td>${ticket.priority}</td>
        <td>${ticket.fecha}</td>
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
    })
    .catch((error) => console.error("Error al obtener los datos:", error));
});
