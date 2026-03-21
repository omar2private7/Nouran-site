document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".reveal");

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    items.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.25,
      rootMargin: "0px 0px -80px 0px",
    }
  );

  items.forEach((el) => io.observe(el));
});
