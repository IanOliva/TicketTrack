
document.addEventListener("DOMContentLoaded", () => {
  const botonFalso = document.querySelector(".addTicketButton");
  const abrirModal = document.getElementById("botonModal");

  botonFalso.addEventListener("click", () => {
    abrirModal.click();
  });
});
