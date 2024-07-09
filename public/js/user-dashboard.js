(function () {
  "use strict";

  var forms = document.querySelectorAll(".needs-validation");

  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
})();

function eventoReal() {
  const botonReal = document.getElementById("submitFormularioModal");
  botonReal.click();
}

document.addEventListener("DOMContentLoaded", function () {
  const toastLiveExample = document.getElementById("liveToast");
  const toastBootstrap = new bootstrap.Toast(toastLiveExample, {
    delay: 2000,
  });
  toastBootstrap.show();
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("guardarDatos");
  const saveButton = document.getElementById("guardarBtn");

  if (saveButton) {
    form.addEventListener("input", function () {
      const inputs = form.querySelectorAll("input");
      let anyFilled = false;
  
      inputs.forEach(function (input) {
        if (input.value.trim().length > 0) {
          anyFilled = true;
        }
      });
  
      saveButton.disabled = !anyFilled;
    });
  }
});
