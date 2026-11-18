const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");
const year = document.querySelector("#year");

if (year) {
  year.textContent = String(new Date().getFullYear());
}

const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const revealTargets = document.querySelectorAll(
  ".about-content, .systems-heading, .systems-note, .expertise-heading, .expertise-card, .statement p, .contact-panel",
);

if (!motionPreference.matches && "IntersectionObserver" in window) {
  document.documentElement.classList.add("motion-ready");
  revealTargets.forEach((target) => target.classList.add("reveal"));

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -36px 0px" },
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
}

if (menuToggle && navigation) {
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      menuToggle.focus();
    }
  });
}

const finePointer = window.matchMedia("(pointer: fine)");
const pageSections = document.querySelectorAll("main section[id]");
const primaryLinks = navigation?.querySelectorAll('a[href^="#"]') ?? [];

if ("IntersectionObserver" in window && primaryLinks.length) {
  const activeSectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        primaryLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
          link.classList.toggle("is-active", active);
        });
      });
    },
    { rootMargin: "-25% 0px -62% 0px", threshold: 0 },
  );

  pageSections.forEach((section) => activeSectionObserver.observe(section));
}

if (!motionPreference.matches) {
  let scrollFrame = 0;
  const updateScrollProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    document.documentElement.style.setProperty("--scroll-progress", String(progress));
    scrollFrame = 0;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(updateScrollProgress);
    },
    { passive: true },
  );
  updateScrollProgress();

  if (finePointer.matches) {
    const heroArt = document.querySelector(".hero-art");
    heroArt?.addEventListener("pointermove", (event) => {
      const bounds = heroArt.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      heroArt.style.setProperty("--hero-shift-x", `${x * 10}px`);
      heroArt.style.setProperty("--hero-shift-y", `${y * 10}px`);
    });
    heroArt?.addEventListener("pointerleave", () => {
      heroArt.style.setProperty("--hero-shift-x", "0px");
      heroArt.style.setProperty("--hero-shift-y", "0px");
    });

    document.querySelectorAll(".system-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        card.style.setProperty("--pointer-x", `${x * 100}%`);
        card.style.setProperty("--pointer-y", `${y * 100}%`);
        card.style.setProperty("--tilt-x", `${(x - 0.5) * 5}deg`);
        card.style.setProperty("--tilt-y", `${(0.5 - y) * 5}deg`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      });
    });
  }
}
