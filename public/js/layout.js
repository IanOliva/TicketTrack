// navbar toggle
document.addEventListener("DOMContentLoaded", function () {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links-nb");

  navToggle.addEventListener("click", function () {
    navLinks.classList.toggle("active");
  });
});
