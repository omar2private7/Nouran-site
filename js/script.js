// ====== Customize these ======
const PERSON_NAME = "Nouran";  
const TARGET_DATE_ISO = "2026-02-27T00:00:00"; 

const SECRET_STAR_MESSAGE = `You deserve this ya best doctor ever! 💗
There’s also a very secret Easter egg made of 3 letters… the first one is “b” 👀  
I’ll be dropping hints throughout the website 😉`;

const SECRET_KONAMI_MESSAGE = "You did it!!! 🥳🥳🥳\n\nkeda 5alasty kol el easter egggsss!!! aw m4 kolo👀 fe lesa wa7da \
httgab lw 8ayarty el url ely fo2 le 7aga keda mo3ayana aw zawedty feh 7aga👀 bas 34an hya m3mola enk mate3rfeha4 fana ktbt feha gomla wa7da bas u can guess it \
bas👀\n\n3al 3omom 7abeb 2a2olk en you deserve the best ya nouran bzat fe 3ed meladk 34an keda 7abet 23mlk el website da w inshallah \
tkony enbasatyy beeh da hayfr7ny awyy w b keda enty 5lsty el website da bas keda keda ely gy 27san inshallah!!!";

const REDIRECT_URL = "message.html";       // 👈 new page

document.addEventListener("DOMContentLoaded", () => {
  const elName = document.getElementById("name");
  const elTargetText = document.getElementById("targetText");

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  const goMessage = document.getElementById("goMessage");
  const mixPolaroid = document.getElementById("mixPolaroid");
  const leaveBtn = document.getElementById("leaveBtn");
  // 👇 Select the new caption element
  const mixCaption = document.getElementById("mixRightCaption");

  if (mixPolaroid) {
    mixPolaroid.addEventListener("click", () => {
      // flip only once
      if (mixPolaroid.classList.contains("is-flipped")) return;

      mixPolaroid.classList.add("is-flipped");

      // show the Leave button only after join
      if (leaveBtn) leaveBtn.classList.remove("hidden");
      
      // 👇 Show the caption smoothly
      if (mixCaption) mixCaption.classList.add("show-caption");
    });
  }


  if (leaveBtn) {
    const container = leaveBtn.parentElement; // assumes it's inside a box (photoSlot)
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Keep track of current position (so movement is smooth + incremental)
    let curX = 0;
    let curY = 0;

    // Tune these
    const SAFE_RADIUS = 60;      // how close the mouse can get before it runs
    const STEP = 35;            // how far it tries to move each time
    const MAX_STEP = 80;

    // Smoothness
    leaveBtn.style.willChange = "transform";
    leaveBtn.style.transition = prefersReduced
      ? "transform 0.01s linear"
      : "transform 280ms cubic-bezier(.2,.9,.2,1)";

    function clamp(v, min, max) {
      return Math.max(min, Math.min(max, v));
    }

    function getRects() {
      const c = container.getBoundingClientRect();
      const b = leaveBtn.getBoundingClientRect();
      return { c, b };
    }

    function moveAwayFrom(mouseX, mouseY) {
      const { c, b } = getRects();

      // Button center
      const btnCx = b.left + b.width / 2;
      const btnCy = b.top + b.height / 2;

      // Vector from mouse -> button (we move along this direction)
      let dx = btnCx - mouseX;
      let dy = btnCy - mouseY;

      const dist = Math.hypot(dx, dy) || 1;

      // Only run if mouse is close enough
      if (dist > SAFE_RADIUS) return;

      // Normalize direction
      dx /= dist;
      dy /= dist;

      // Strength increases as mouse gets closer (more “panic”)
      const panic = clamp((SAFE_RADIUS - dist) / SAFE_RADIUS, 0, 1);

      // Compute step distance
      const step = clamp(STEP * (0.6 + panic), 10, MAX_STEP);


      // Proposed new position in local transform space
      let nextX = curX + dx * step;
      let nextY = curY + dy * step;

      // Clamp inside container bounds (so it stays visible)
      // NOTE: transform doesn't change offsetLeft, so we clamp using available space.
      const maxX = c.width - b.width;
      const maxY = c.height - b.height;

      // Current visual "top-left" of button relative to container:
      const btnLeftInContainer = (b.left - c.left) - curX;
      const btnTopInContainer = (b.top - c.top) - curY;

      // Clamp so (btnLeft + translateX) stays within [0, maxX]
      nextX = clamp(nextX, -btnLeftInContainer, maxX - btnLeftInContainer);
      nextY = clamp(nextY, -btnTopInContainer, maxY - btnTopInContainer);

      curX = nextX;
      curY = nextY;

      leaveBtn.style.transform = `translate(calc(-50% + ${curX}px), ${curY}px)`;
    }

    // More accurate than mouseenter: respond as the mouse approaches
    container.addEventListener("pointermove", (e) => {
      moveAwayFrom(e.clientX, e.clientY);
    });

    // Optional: on touch devices, move when they try to tap
    leaveBtn.addEventListener("pointerdown", (e) => {
      moveAwayFrom(e.clientX, e.clientY);
    });
  }

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
    console.warn("Countdown elements missing: #days #hours #minutes #seconds");
    return;
  }

  if (elName) elName.textContent = PERSON_NAME;

  const targetDate = new Date(TARGET_DATE_ISO);
  if (Number.isNaN(targetDate.getTime()) && elTargetText) {
    elTargetText.textContent = "⚠️ Invalid TARGET_DATE_ISO. Edit script.js and set a valid date.";
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

// ====== Upgraded Confetti (Rose Gold Edition) ======
  function burstConfetti() {
    const colors = ['#d94b75', '#ff9a9e', '#ffd700', '#ffffff', '#fbc2eb'];
    
    for (let i = 0; i < 100; i++) {
      const dot = document.createElement("div");
      dot.style.position = "fixed";
      dot.style.left = Math.random() * 100 + "vw";
      dot.style.top = "-10px";
      dot.style.width = Math.random() * 10 + 5 + "px"; // varies size
      dot.style.height = dot.style.width;
      dot.style.borderRadius = "50%";
      
      // Randomly pick a color from our palette
      dot.style.background = colors[Math.floor(Math.random() * colors.length)];
      
      dot.style.zIndex = "9999";
      dot.style.pointerEvents = "none";
      dot.style.opacity = "0.9";

      const duration = 1500 + Math.random() * 1500;
      const drift = (Math.random() - 0.5) * 150;

      document.body.appendChild(dot);

      const start = performance.now();
      function animate(t) {
        const p = (t - start) / duration;
        if (p >= 1) {
          dot.remove();
          return;
        }
        // Add rotation and fall
        dot.style.transform = `translate(${drift * p}px, ${window.innerHeight * p}px) rotate(${p * 360}deg)`;
        dot.style.opacity = String(0.9 - p * 0.9);
        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    }
  }

  // ✅ NEW: trigger once, clear interval, confetti then redirect
  let finished = false;
  let timerId = null;

  function finishSequence() {
    if (finished) return;
    finished = true;

    // lock display at zeros
    daysEl.textContent = "0";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";

    burstConfetti();

  if (elTargetText) elTargetText.textContent = "🎉 It’s time!";

  if (timerId) clearInterval(timerId);

  // show the click text
  if (goMessage) goMessage.classList.remove("hidden");
  }

  function updateCountdown() {
    const now = new Date();
    const diffMs = targetDate - now;

    // if (elTargetText && !Number.isNaN(targetDate.getTime())) {
    //   elTargetText.textContent = `Countdown to: ${targetDate.toLocaleString()}`;
    // }

    if (diffMs <= 0) {
      finishSequence();
      return;
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = String(days);
    hoursEl.textContent = pad2(hours);
    minutesEl.textContent = pad2(minutes);
    secondsEl.textContent = pad2(seconds);
  }

  updateCountdown();
  timerId = setInterval(updateCountdown, 1000);

  // ====== Modal helper (keep yours as-is) ======
  const backdrop = document.getElementById("modalBackdrop");
  const closeModalBtn = document.getElementById("closeModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalText = document.getElementById("modalText");

  function openModal(title, text) {
    if (!backdrop || !modalTitle || !modalText) return;
    modalTitle.textContent = title;
    modalText.textContent = text;
    backdrop.classList.remove("hidden");
  }
  function closeModal() {
    if (!backdrop) return;
    backdrop.classList.add("hidden");
  }

  if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
  if (backdrop) backdrop.addEventListener("click", (e) => { if (e.target === backdrop) closeModal(); });

  const tinyStar = document.getElementById("tinyStar");
  if (tinyStar) tinyStar.addEventListener("click", () => openModal("You Found it ⭐ awl Easter egg!!", SECRET_STAR_MESSAGE));

  const konami = ["b", "r", "o"];
  let kIndex = 0;

  function triggerShake() {
    document.body.classList.add("shake");
    setTimeout(() => document.body.classList.remove("shake"), 250);
  }

  window.addEventListener("keydown", (e) => {
    const key = (e.key || "").toLowerCase();

    if (key === konami[kIndex]) {
      kIndex++;

      if (kIndex === konami.length) {
        kIndex = 0;
        openModal("👀👀👀", SECRET_KONAMI_MESSAGE);
        burstConfetti();
      }
    } else {
      // only shake if they started the sequence already
      if (kIndex > 0) triggerShake();
      kIndex = 0;
    }
  });

  if (location.hash.toLowerCase() === "#surprise") {
    gtag('event', 'surprise_unlocked');
    
    openModal(
      "What! you found it 😲",
      "Because u won't find it i will say it:\nMHIYPDEGIBTM ya Nouran❤️!!"
    );
  }
  if (goMessage) {
    goMessage.addEventListener("click", () => {
      document.body.classList.add("page-exit");

      // wait for animation to finish before navigating
      setTimeout(() => {
        window.location.href = REDIRECT_URL;
      }, 520); // must match CSS duration
    });
  }
});