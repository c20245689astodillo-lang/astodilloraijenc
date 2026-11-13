import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const timeline = gsap.timeline({
  defaults: { duration: 0.5, ease: "power2.out" },
});

timeline
  .from("h1", { y: -60, opacity: 0, duration: 1, ease: "bounce.out" })
  .from(".email", { y: 30, opacity: 0, duration: 0.8 })
  .from("nav a", {
    y: -20,
    opacity: 0,
    duration: 0.5,
    stagger: 0.5,
  })
  .from("#about", {
    y: 40,
    opacity: 0,
    duration: 1,
    ease: "back.out(2.5)",
  });

document.querySelector("#replayTimeline")?.addEventListener("click", () => {
  timeline.restart();
});

 gsap.from("#services", {
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
    trigger: "#services",
    start: "top 80%",
    toggleActions: "play none none reverse",
    }
});

gsap.fromTo(
  "#progressBar",
  { scaleX: 0 },
  {
    scaleX: 1,
    ease: "none",
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    },
  },
);

ScrollTrigger.create({
  trigger: "#services",
  start: "top top",
  end: "bottom top",
  pin: true,
});

const darkModeButton = document.querySelector("#toggledark");
darkModeButton?.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  gsap.to(darkModeButton, {
    rotation: "+=360",
    duration: 0.6,
    ease: "power2.out",
  });
});
