"use strict";
(() => {
  const config = window.INVITATION;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll("[data-world-image]").forEach(image => {
    if (config.ambientacion?.src) image.src = config.ambientacion.src;
    if (image.getAttribute("aria-hidden") !== "true") image.alt = config.ambientacion?.alt || "";
  });
  document.querySelectorAll("[data-name-initial]").forEach(element => {
    element.textContent = Array.from(config.nombre.trim())[0] || "";
  });
  document.querySelectorAll("[data-world-calendar]").forEach(button => {
    button.addEventListener("click", () => document.getElementById("calendarBtn").click());
  });
  const sections = [...document.querySelectorAll("[data-world-reveal]")];
  if (!reduced && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("world-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    sections.forEach(section => observer.observe(section));
    document.body.classList.add("world-motion");
    document.addEventListener("focusin", event => {
      const section = event.target.closest("[data-world-reveal]");
      if (section) { section.classList.add("world-visible"); observer.unobserve(section); }
    });
  }
  // Keep the introduction visible if animation support is unavailable.
  else sections.forEach(section => section.classList.add("world-visible"));
  if (document.body.classList.contains("ladybug")) {
    const skyline = document.querySelector(".world-stage");
    if (skyline && "IntersectionObserver" in window) {
      const dusk = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          skyline.classList.add("world-dusk"); dusk.disconnect();
        }
      }, { threshold: 0.3 });
      dusk.observe(skyline);
    }
  }
})();
