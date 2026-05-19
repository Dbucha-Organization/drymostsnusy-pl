(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = document.body;
  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const year = document.querySelector("[data-year]");

  document.documentElement.classList.add("js");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  function setHeaderState() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      body.classList.toggle("nav-open", !isOpen);
    });

    nav.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof HTMLAnchorElement) {
        navToggle.setAttribute("aria-expanded", "false");
        body.classList.remove("nav-open");
      }
    });
  }

  function createStars(container, amount) {
    if (!container) return;

    const fragment = document.createDocumentFragment();
    const colors = [
      "rgba(255,255,255,0.9)",
      "rgba(166,108,255,0.85)",
      "rgba(102,244,255,0.72)",
      "rgba(255,178,92,0.62)"
    ];

    for (let index = 0; index < amount; index += 1) {
      const star = document.createElement("span");
      const size = Math.random() > 0.86 ? 3 : Math.random() > 0.55 ? 2 : 1;
      star.className = "star";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.setProperty("--size", `${size}px`);
      star.style.setProperty("--opacity", `${0.36 + Math.random() * 0.58}`);
      star.style.setProperty("--duration", `${2.8 + Math.random() * 4.8}s`);
      star.style.setProperty("--delay", `${Math.random() * -5}s`);
      star.style.setProperty("--color", colors[index % colors.length]);
      fragment.appendChild(star);
    }

    container.appendChild(fragment);
  }

  createStars(document.querySelector("[data-starfield]"), 96);
  createStars(document.querySelector("[data-starfield-small]"), 54);

  if (!prefersReducedMotion) {
    const root = document.querySelector("[data-parallax-root]");
    const canvases = document.querySelectorAll(".cosmic-canvas");

    window.addEventListener(
      "pointermove",
      (event) => {
        if (!root || event.pointerType === "touch") return;
        const x = (event.clientX / window.innerWidth - 0.5) * 2;
        const y = (event.clientY / window.innerHeight - 0.5) * 2;
        root.style.setProperty("--mx", x.toFixed(3));
        root.style.setProperty("--my", y.toFixed(3));
        canvases.forEach((canvas) => {
          canvas.style.setProperty("--mx", x.toFixed(3));
          canvas.style.setProperty("--my", y.toFixed(3));
        });
      },
      { passive: true }
    );

  }

  document.querySelectorAll("[data-accordion]").forEach((accordion) => {
    accordion.addEventListener("click", (event) => {
      const button = event.target instanceof Element ? event.target.closest("button") : null;
      if (!button) return;

      const item = button.closest(".faq-item");
      if (!item) return;

      const isOpen = button.getAttribute("aria-expanded") === "true";

      accordion.querySelectorAll(".faq-item").forEach((faqItem) => {
        const faqButton = faqItem.querySelector("button");
        faqItem.classList.remove("is-open");
        if (faqButton) faqButton.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -30px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
  } else {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
  }
})();
