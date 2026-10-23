(() => {
  const textSelector = [
    ".cover-copy > .eyebrow",
    ".cover-copy > h1",
    ".cover-copy > .hero-subtitle",
    ".cover-copy > .hero-date",
    ".section h2",
    ".section h3",
    ".section .eyebrow",
    ".section .section-heading > p",
    ".letter-copy > p",
    ".world-stage h2",
    ".world-stage .eyebrow",
    ".world-stage .world-intro > p"
  ].join(",");
  const textElements = [...document.querySelectorAll(textSelector)];

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    textElements.forEach((element) => element.classList.add("text-reveal-visible"));
    return;
  }

  const groups = new Map();
  textElements.forEach((element) => {
    const group = element.closest(".cover-copy, .section, .world-stage") || element.parentElement;
    const order = groups.get(group) || 0;
    groups.set(group, order + 1);
    element.style.setProperty("--text-order", Math.min(order, 4));
    element.classList.add("text-reveal");
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("text-reveal-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -5% 0px" });

  textElements.forEach((element) => observer.observe(element));
})();
