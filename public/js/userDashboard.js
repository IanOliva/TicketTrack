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


document.addEventListener("DOMContentLoaded", () => {
  const botonFalso = document.querySelector(".addTicketButton");
  const abrirModal = document.getElementById("botonModal");

  botonFalso.addEventListener("click", () => {
    abrirModal.click();
  });
});
