document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // Step 2: show side images
  setTimeout(() => body.classList.add("show-sides"), 300);

  // Step 3: show cake last
  setTimeout(() => body.classList.add("show-cake"), 1100);

  // ---- egg logic ----
  const egg = document.getElementById("cakeEgg");
  const backdrop = document.getElementById("eggBackdrop");
  const closeBtn = document.getElementById("eggClose");
  const titleEl = document.getElementById("eggTitle");
  const textEl = document.getElementById("eggText");

  if (!egg || !backdrop || !closeBtn || !titleEl || !textEl) return;

  const EGG_TITLE = "4atraaa la2ety tany Easter egg!!!";
  const EGG_MESSAGE =
    'De cake 3mltlha ana design 34an keda 4klha m4 awy 4waya👀😂 bas hope u like it lonha pink w feha ward✨💖\
    3al 3omom hadyky tany 7arf mel kelma w hwa "r" 👀...\
    2arabna n5lshom 2/3!! yatara eh ely hy7sal b3d 2a5r easter egg👀';

  // ====== Upgraded Confetti (Rose Gold Edition) ======
  function burstConfetti() {
    const colors = ['#d94b75', '#ff9a9e', '#ffd700', '#ffffff', '#fbc2eb'];
    
    for (let i = 0; i < 80; i++) {
      const dot = document.createElement("div");
      dot.style.position = "fixed";
      dot.style.left = Math.random() * 100 + "vw";
      dot.style.top = "-10px";
      dot.style.width = Math.random() * 10 + 5 + "px";
      dot.style.height = dot.style.width;
      dot.style.borderRadius = "50%";
      dot.style.background = colors[Math.floor(Math.random() * colors.length)];
      dot.style.zIndex = "10000";
      dot.style.pointerEvents = "none";
      dot.style.opacity = "0.9";

      const duration = 1200 + Math.random() * 1500;
      const drift = (Math.random() - 0.5) * 150;

      document.body.appendChild(dot);

      const start = performance.now();
      function animate(t) {
        const p = (t - start) / duration;
        if (p >= 1) return dot.remove();
        dot.style.transform = `translate(${drift * p}px, ${window.innerHeight * p}px) rotate(${p * 360}deg)`;
        dot.style.opacity = String(0.9 - p * 0.9);
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