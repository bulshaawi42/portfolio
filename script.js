const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");
const year = document.querySelector("#year");
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

if (year) year.textContent = String(new Date().getFullYear());

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
    if (event.target instanceof HTMLAnchorElement) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuToggle.focus();
    }
  });
}

const revealTargets = document.querySelectorAll(".reveal");
if (!motionPreference.matches && "IntersectionObserver" in window && revealTargets.length) {
  document.documentElement.classList.add("motion-ready");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
  revealTargets.forEach((target) => revealObserver.observe(target));
}

if (!motionPreference.matches) {
  let scrollFrame = 0;
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    document.documentElement.style.setProperty("--scroll-progress", String(progress));
    scrollFrame = 0;
  };
  window.addEventListener("scroll", () => {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateProgress);
  }, { passive: true });
  updateProgress();

  if (window.matchMedia("(pointer: fine)").matches) {
    const visual = document.querySelector(".hero-visual");
    visual?.addEventListener("pointermove", (event) => {
      const rect = visual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      visual.style.setProperty("--px", `${x * 2.6}deg`);
      visual.style.setProperty("--py", `${-y * 2.6}deg`);
    });
    visual?.addEventListener("pointerleave", () => {
      visual.style.setProperty("--px", "0deg");
      visual.style.setProperty("--py", "0deg");
    });

    document.querySelectorAll(".work-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        card.style.setProperty("--tilt-x", `${(x - 0.5) * 3}deg`);
        card.style.setProperty("--tilt-y", `${(0.5 - y) * 3}deg`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      });
    });
  }
}
