document.addEventListener("DOMContentLoaded", () => {
    const letterBox = document.querySelector(".glass-letter");
    if (!letterBox) return;

    // ─── Config ───────────────────────────────────────────────────────────────
    const FADE_IN_DELAY_MS    = 150;
    const FADE_IN_DURATION_MS = 800;
    const BASE_SPEED_MS       = 28;
    const VARIANCE_MS         = 18;
    const PAUSE_AT_COMMA_MS   = 120;
    const PAUSE_AT_PERIOD_MS  = 260;

    // ─── Respect prefers-reduced-motion ──────────────────────────────────────
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ─── Collect paragraphs & store original text ─────────────────────────────
    const paragraphs     = Array.from(document.querySelectorAll(".letter-content p"));
    if (!paragraphs.length) return;
    const paragraphTexts = paragraphs.map((p) => p.textContent);
    paragraphs.forEach((p) => { p.textContent = ""; });

    // ─── Cursor element ───────────────────────────────────────────────────────
    const cursor = document.createElement("span");
    cursor.className = "typing-cursor";
    cursor.setAttribute("aria-hidden", "true");

    // ─── Skip button (created in JS — no HTML change needed) ─────────────────
    const skipBtn = document.createElement("button");
    skipBtn.className   = "skip-typing-btn";
    skipBtn.textContent = "Skip ↓";
    skipBtn.setAttribute("aria-label", "Reveal full message instantly");
    // Place it just after the letter title so it sits at the top of the card
    const letterTitle = letterBox.querySelector(".letter-title");
    if (letterTitle) letterTitle.insertAdjacentElement("afterend", skipBtn);
    else             letterBox.prepend(skipBtn);

    // ─── Shared cancellation token ────────────────────────────────────────────
    // All setTimeout calls go through scheduleNext so one cancelTyping() stops
    // everything — no leaked callbacks after skip.
    let pendingTimeout = null;

    function scheduleNext(fn, delay) {
        pendingTimeout = setTimeout(fn, delay);
    }

    function cancelTyping() {
        if (pendingTimeout !== null) {
        clearTimeout(pendingTimeout);
        pendingTimeout = null;
        }
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────
    function revealAll() {
        cancelTyping();
        cursor.remove();
        // Wipe any partial text nodes and replace with the full string
        paragraphs.forEach((p, i) => { p.textContent = paragraphTexts[i]; });
        dismissSkipBtn();
    }

    function dismissSkipBtn() {
        // Disable immediately so double-clicks / keyboard repeat are harmless
        skipBtn.disabled = true;
        skipBtn.classList.add("skip-typing-btn--done");
        // Remove from DOM once the CSS fade-out transition finishes
        skipBtn.addEventListener("transitionend", () => skipBtn.remove(), { once: true });
    }

    skipBtn.addEventListener("click", revealAll);

    // ─── Boot sequence ────────────────────────────────────────────────────────
    scheduleNext(() => {
        letterBox.classList.add("is-visible");

        // Reduced-motion: reveal text instantly after fade-in, no typing at all
        if (prefersReduced) {
        scheduleNext(revealAll, FADE_IN_DURATION_MS);
        return;
        }

        scheduleNext(startTypewriter, FADE_IN_DURATION_MS);
    }, FADE_IN_DELAY_MS);

    // ─── Typewriter engine ────────────────────────────────────────────────────
    function startTypewriter() {
        let paraIndex = 0;
        let charIndex = 0;

        paragraphs[0].appendChild(cursor);

        function typeNextChar() {
        // All done naturally — tidy up and remove skip button
        if (paraIndex >= paragraphs.length) {
            cursor.remove();
            dismissSkipBtn();
            return;
        }

        const currentPara = paragraphs[paraIndex];
        const fullText    = paragraphTexts[paraIndex];

        // Current paragraph exhausted — advance
        if (charIndex >= fullText.length) {
            paraIndex++;
            charIndex = 0;

            if (paraIndex < paragraphs.length) {
            paragraphs[paraIndex].appendChild(cursor);
            cursor.scrollIntoView({ behavior: "smooth", block: "nearest" });
            } else {
            cursor.remove();
            dismissSkipBtn();
            return;
            }

            scheduleNext(typeNextChar, PAUSE_AT_PERIOD_MS * 1.5);
            return;
        }

        // Type one character
        const char = fullText[charIndex];
        currentPara.insertBefore(document.createTextNode(char), cursor);
        charIndex++;

        let delay = BASE_SPEED_MS + Math.random() * VARIANCE_MS;
        if (/[,;:]/.test(char)) delay += PAUSE_AT_COMMA_MS;
        if (/[.!?]/.test(char)) delay += PAUSE_AT_PERIOD_MS;

        scheduleNext(typeNextChar, delay);
        }

        typeNextChar();
    }
});