const body = document.querySelector("body");
modeToggle = body.querySelector(".mode-toggle");
sidebar = body.querySelector("nav");
cambioModo = body.querySelector(".cambioModo");
nombreModo = body.querySelector(".nombreModo");

sidebarToggle = body.querySelector(".sidebar-toggle");
const sidebarIcon = sidebarToggle.querySelector("i");
sidebarIcon.style.transition = "transform 0.3s ease"

let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark") {
  body.classList.add("dark");
  cambioModo.innerHTML = '<i class="fa-regular fa-sun"></i>';
  nombreModo.textContent = "Modo claro";
} else {
  cambioModo.innerHTML = '<i class="fa-regular fa-moon"></i>';
  nombreModo.textContent = "Modo oscuro";
}

let getStatus = localStorage.getItem("status");
if (getStatus && getStatus === "close") {
  sidebar.classList.toggle("close");
  sidebarIcon.style.transform = "rotate(180deg)";
}

modeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  if (body.classList.contains("dark")) {
    localStorage.setItem("mode", "dark");
    cambioModo.innerHTML = '<i class="fa-regular fa-sun"></i>';
    nombreModo.textContent = "Modo claro";
  } else {
    localStorage.setItem("mode", "light");
    cambioModo.innerHTML = '<i class="fa-regular fa-moon"></i>';
    nombreModo.textContent = "Modo oscuro";
  }
});

sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
  if (sidebar.classList.contains("close")) {
    
    localStorage.setItem("status", "close");
    sidebarIcon.style.transform = "rotate(180deg)";
  } else {

    localStorage.setItem("status", "open");
    sidebarIcon.style.transform = "rotate(0deg)";
  }
});
