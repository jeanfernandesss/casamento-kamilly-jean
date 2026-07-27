(() => {
  "use strict";
  const body = document.body;
  const header = document.getElementById("site-header");
  const progress = document.getElementById("scroll-progress-bar");
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");
  const navLinks = [...document.querySelectorAll(".nav__menu a")];
  body.classList.add("is-ready");

  const setMenu = (open) => {
    toggle?.classList.toggle("is-open", open);
    menu?.classList.toggle("is-open", open);
    header?.classList.toggle("menu-visible", open);
    body.classList.toggle("menu-open", open);
    toggle?.setAttribute("aria-expanded", String(open));
    toggle?.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };
  toggle?.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  navLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle?.getAttribute("aria-expanded") === "true") {
      setMenu(false); toggle.focus();
    }
  });

  const updateScroll = () => {
    const top = window.scrollY;
    header?.classList.toggle("is-scrolled", top > 28);
    const available = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.width = `${available > 0 ? Math.min(100, top / available * 100) : 0}%`;
  };
  updateScroll();
  addEventListener("scroll", updateScroll, { passive: true });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: "0px 0px -40px" });
    revealItems.forEach((item) => revealObserver.observe(item));

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-38% 0px -56% 0px" });
    document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const wedding = new Date("2026-11-14T17:00:00-03:00").getTime();
  const countdownFields = {
    days: document.getElementById("countdown-days"),
    hours: document.getElementById("countdown-hours"),
    minutes: document.getElementById("countdown-minutes"),
    seconds: document.getElementById("countdown-seconds"),
  };
  const padCountdown = (value, length = 2) => String(Math.max(0, value)).padStart(length, "0");
  const updateCountdown = () => {
    const distance = Math.max(0, wedding - Date.now());
    const values = {
      days: Math.floor(distance / 86400000),
      hours: Math.floor(distance % 86400000 / 3600000),
      minutes: Math.floor(distance % 3600000 / 60000),
      seconds: Math.floor(distance % 60000 / 1000),
    };

    if (countdownFields.days) countdownFields.days.textContent = padCountdown(values.days, 3);
    if (countdownFields.hours) countdownFields.hours.textContent = padCountdown(values.hours);
    if (countdownFields.minutes) countdownFields.minutes.textContent = padCountdown(values.minutes);
    if (countdownFields.seconds) countdownFields.seconds.textContent = padCountdown(values.seconds);
  };
  updateCountdown();
  setInterval(updateCountdown, 1000);

  const copyPix = document.getElementById("copy-pix");
  const copyStatus = document.getElementById("pix-copy-status");
  const copyText = async (value) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return;
    }

    const field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    if (!copied) throw new Error("Cópia não suportada");
  };

  copyPix?.addEventListener("click", async () => {
    const key = copyPix.getAttribute("data-pix-key");
    if (!key) return;

    try {
      await copyText(key);
      if (copyStatus) copyStatus.textContent = "Chave Pix copiada!";
      copyPix.classList.add("is-copied");
      setTimeout(() => {
        if (copyStatus) copyStatus.textContent = "";
        copyPix.classList.remove("is-copied");
      }, 2600);
    } catch {
      if (copyStatus) copyStatus.textContent = "Não foi possível copiar. Selecione a chave acima.";
    }
  });
})();
