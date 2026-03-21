document.addEventListener("DOMContentLoaded", () => {
  // ===== Reveal animation (your existing logic) =====
  const items = document.querySelectorAll(".reveal");

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    items.forEach(el => el.classList.add("in-view"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.25,
      rootMargin: "0px 0px -80px 0px"
    });

    items.forEach(el => io.observe(el));
  }

  // ===== Memories Easter egg modal =====
  const egg = document.getElementById("memoryEgg");
  const backdrop = document.getElementById("memEggBackdrop");
  const closeBtn = document.getElementById("memEggClose");
  const titleEl = document.getElementById("memEggTitle");
  const textEl = document.getElementById("memEggText");

  if (!egg || !backdrop || !closeBtn || !titleEl || !textEl) return;

  const EGG_TITLE = "Oooooo an Easter Eggg 😭💗";
  const EGG_MESSAGE =
    'La2ety el talet wel 2a5er!! 😂\nHena 7arf tany… "o" 👀 zmank asln konty 3arfa el kelma men badry... bas aked m4 3rfa tst5demeha ezay👀 2rga3y lel counter page w 2ktby 3al keyboard el 3 7orof 34an ytl3lk el secret message!!!';

  function burstConfetti() {
    for (let i = 0; i < 55; i++) {
      const dot = document.createElement("div");
      dot.style.position = "fixed";
      dot.style.left = Math.random() * 100 + "vw";
      dot.style.top = "-10px";
      dot.style.width = "8px";
      dot.style.height = "8px";
      dot.style.borderRadius = "999px";
      dot.style.background = `hsl(${Math.random() * 360}, 90%, 60%)`;
      dot.style.zIndex = "10001";
      dot.style.pointerEvents = "none";
      dot.style.opacity = "0.95";

      const duration = 900 + Math.random() * 1200;
      const drift = (Math.random() - 0.5) * 140;

      document.body.appendChild(dot);

      const start = performance.now();
      function animate(t) {
        const p = (t - start) / duration;
        if (p >= 1) return dot.remove();
        dot.style.transform = `translate(${drift * p}px, ${window.innerHeight * p}px) rotate(${p * 720}deg)`;
        dot.style.opacity = String(0.95 - p * 0.9);
        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    }
  }

  function openEgg() {
    titleEl.textContent = EGG_TITLE;
    textEl.textContent = EGG_MESSAGE;
    backdrop.classList.remove("hidden");
    burstConfetti();
  }

  function closeEgg() {
    backdrop.classList.add("hidden");
  }

  egg.addEventListener("click", openEgg);
  closeBtn.addEventListener("click", closeEgg);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeEgg();
  });
});

/* ... [KEEP YOUR EXISTING REVEAL AND EASTER EGG LOGIC UNCHANGED] ... */

// ===== Bonuses magnetic / parallax button =====
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("bonusBtn"); // Updated ID
  if (!btn) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  let raf = null;
  let lastX = 0;
  let lastY = 0;

  function update() {
    raf = null;
    const r = btn.getBoundingClientRect();

    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;

    const dx = (lastX - cx) / r.width;
    const dy = (lastY - cy) / r.height;

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const x = clamp(dx, -0.6, 0.6);
    const y = clamp(dy, -0.6, 0.6);

    const tilt = 10;     
    const lift = 10;     

    const tx = x * lift;
    const ty = y * lift;
    const rx = (-y * tilt).toFixed(3);
    const ry = (x * tilt).toFixed(3);

    const px = ((x + 0.5) * 100).toFixed(2) + "%";
    const py = ((y + 0.5) * 100).toFixed(2) + "%";

    btn.style.setProperty("--px", px);
    btn.style.setProperty("--py", py);
    btn.style.transform = `translate(${tx}px, ${ty}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  }

  function onMove(e) {
    lastX = e.clientX;
    lastY = e.clientY;
    if (raf) return;
    raf = requestAnimationFrame(update);
  }

  function reset() {
    if (raf) {
      cancelAnimationFrame(raf);
      raf = null;
    }
    btn.style.setProperty("--px", "50%");
    btn.style.setProperty("--py", "50%");
    btn.style.transform = "translate(0px, 0px) rotateX(0deg) rotateY(0deg)";
  }

  btn.addEventListener("pointermove", onMove);
  btn.addEventListener("pointerleave", reset);
  btn.addEventListener("pointerdown", onMove);
});
