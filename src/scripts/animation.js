import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const replayButton = document.querySelector("#replayTimeline");
const themeButton = document.querySelector("#toggledark");

let introTimeline;

function updateThemeButton() {
  if (!themeButton) return;

  const nextTheme = document.documentElement.classList.contains("dark") ? "light" : "dark";
  themeButton.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
  themeButton.setAttribute("title", `Switch to ${nextTheme} theme`);
}

updateThemeButton();

if (replayButton) {
  replayButton.hidden = reduceMotion.matches;
  reduceMotion.addEventListener("change", (event) => {
    replayButton.hidden = event.matches;
  });
}

themeButton?.addEventListener("click", () => {
  const isDark = document.documentElement.classList.toggle("dark");

  try {
    localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
  } catch {
    // The theme still works for this visit if browser storage is unavailable.
  }

  updateThemeButton();

  if (!reduceMotion.matches) {
    gsap.to(themeButton, { rotation: "+=360", duration: 0.6, ease: "power2.out" });
  }
});

const motion = gsap.matchMedia();

motion.add("(prefers-reduced-motion: no-preference)", () => {
  const introElements = gsap.utils.toArray(
    "[data-intro-eyebrow], [data-intro-title], [data-intro-copy], [data-intro-action], nav a",
  );

  introTimeline = gsap.timeline({
    defaults: { duration: 0.8, ease: "power2.out" },
    onComplete: () => gsap.set(introElements, { clearProps: "opacity,visibility,transform" }),
  });

  introTimeline
    .fromTo("nav a", { y: -12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.45, duration: 1.35, immediateRender: false })
    .fromTo("[data-intro-eyebrow]", { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, immediateRender: false }, "-=0.2")
    .fromTo("[data-intro-title]", { y: -35, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, ease: "power3.out", immediateRender: false }, "-=0.15")
    .fromTo("[data-intro-copy]", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, immediateRender: false }, "-=0.2")
    .fromTo("[data-intro-action]", { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, immediateRender: false }, "-=0.1")

  introTimeline.timeScale(0.7);

  gsap.utils.toArray("[data-scroll-reveal]").forEach((section) => {
    const items = section.querySelectorAll("[data-reveal-item]");
    if (!items.length) return;

    let hasRevealed = false;
    const revealItems = () => {
      if (hasRevealed) return;
      hasRevealed = true;

      gsap.fromTo(
        items,
        { y: 36, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1.05,
          stagger: 0.2,
          ease: "power2.out",
          onComplete: () => gsap.set(items, { clearProps: "opacity,visibility,transform" }),
        },
      );
    };

    ScrollTrigger.create({
      trigger: section,
      start: "top 78%",
      once: true,
      onEnter: revealItems,
      onRefresh: (trigger) => {
        if (trigger.progress > 0) revealItems();
      },
    });
  });

  gsap.fromTo(
    "#progressBar",
    { scaleX: 0 },
    {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    },
  );

  return () => {
    introTimeline = undefined;
  };
});

replayButton?.addEventListener("click", () => {
  if (introTimeline && !reduceMotion.matches) introTimeline.restart();
});
