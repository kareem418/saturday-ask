/* ============================================================
   Official Saturday Investigation — Client logic
   ============================================================ */

(() => {
  "use strict";

  // ---------- DOM references ----------
  const appCard = document.getElementById("appCard");
  const screenIntro = document.getElementById("screenIntro");
  const screenQuestion = document.getElementById("screenQuestion");
  const screenLoading = document.getElementById("screenLoading");
  const screenSuccess = document.getElementById("screenSuccess");

  const introLines = document.getElementById("introLines");
  const buttonStage = document.getElementById("buttonStage");
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const dodgeFeedback = document.getElementById("dodgeFeedback");

  const progressFill = document.getElementById("progressFill");
  const progressPercent = document.getElementById("progressPercent");
  const resultNumber = document.getElementById("resultNumber");

  const emojiField = document.getElementById("emojiField");
  const confettiCanvas = document.getElementById("confettiCanvas");

  // ---------- State ----------
  let noAttempts = 0;

  // ---------- Screen transitions ----------
  function showScreen(target) {
    const current = document.querySelector(".screen.is-active");
    if (current === target) return;

    if (current) {
      current.style.transition = "opacity 0.22s ease";
      current.style.opacity = "0";
      setTimeout(() => {
        current.classList.remove("is-active");
        current.style.opacity = "";
        current.style.transition = "";
        target.classList.add("is-active");
      }, 220);
    } else {
      target.classList.add("is-active");
    }
  }

  // ---------- Screen 1: intro sequence ----------
  const INTRO_LINES = [
    "Saturday is approaching...",
    "Scientists have analyzed the data...",
    "Cafés remain operational...",
    "Food still tastes good...",
    "Therefore...",
  ];

  function runIntroSequence() {
    let i = 0;

    function addNextLine() {
      if (i >= INTRO_LINES.length) {
        setTimeout(() => showScreen(screenQuestion), 950);
        return;
      }
      const line = document.createElement("div");
      line.className = "intro-line";
      if (i === INTRO_LINES.length - 1) line.classList.add("is-final");
      line.textContent = INTRO_LINES[i];
      introLines.appendChild(line);
      i += 1;
      setTimeout(addNextLine, 800);
    }

    setTimeout(addNextLine, 550);
  }

  // ---------- Screen 2: the dodging "No" button ----------
  const DODGE_MESSAGES = [
    "Are you sure?",
    "Really sure?",
    "Last chance...",
    "This button is unavailable 😂",
    "Nice try 😏",
  ];

  const BONUS_DODGE_MESSAGES = [
    "Statistically improbable.",
    "I've grown legs. 🦵",
    "Try a different button, maybe?",
    "404: 'No' not found.",
    "This is now a game of tag.",
    "Still dodging. Still smiling.",
  ];

  function nextDodgeMessage() {
    if (noAttempts <= DODGE_MESSAGES.length) {
      return DODGE_MESSAGES[noAttempts - 1];
    }
    const index = (noAttempts - DODGE_MESSAGES.length - 1) % BONUS_DODGE_MESSAGES.length;
    return BONUS_DODGE_MESSAGES[index];
  }

  function dodgeNoButton() {
    noAttempts += 1;

    const stageRect = buttonStage.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    const padding = 6;

    const maxX = Math.max(stageRect.width - btnRect.width - padding, 0);
    const maxY = Math.max(stageRect.height - btnRect.height - padding, 0);

    const newX = padding / 2 + Math.random() * maxX;
    const newY = padding / 2 + Math.random() * maxY;
    const wiggle = (Math.random() * 16 - 8).toFixed(1);

    noBtn.style.left = `${newX}px`;
    noBtn.style.top = `${newY}px`;
    noBtn.style.transform = `rotate(${wiggle}deg)`;

    dodgeFeedback.textContent = nextDodgeMessage();
  }

  function bindNoButtonEvents() {
    // Hovering (mouse / pen) sends it running.
    noBtn.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse" || event.pointerType === "pen") {
        dodgeNoButton();
      }
    });

    // Clicking / tapping never actually registers — it just dodges again.
    noBtn.addEventListener("click", (event) => {
      event.preventDefault();
      dodgeNoButton();
    });
  }

  // ---------- Screen 3: fake loading sequence ----------
  function startFakeLoading() {
    progressFill.style.width = "0%";
    progressPercent.textContent = "0%";

    let pct = 0;
    const interval = setInterval(() => {
      pct += Math.random() * 9 + 4;
      if (pct >= 100) {
        pct = 100;
        clearInterval(interval);
        progressFill.style.width = "100%";
        progressPercent.textContent = "100%";
        finishLoading();
      } else {
        progressFill.style.width = `${pct}%`;
        progressPercent.textContent = `${Math.floor(pct)}%`;
      }
    }, 170);
  }

  function finishLoading() {
    // No backend in the Streamlit build — the verdict is final and unanimous.
    const percentage = 98.7;
    resultNumber.textContent = `${percentage.toFixed(1)}%`;

    setTimeout(() => {
      showScreen(screenSuccess);
      shakeCard();
      launchConfetti();
      reportAnswer("yes");
    }, 350);
  }

  function reportAnswer(answer) {
    // No server to log to here, but we keep a friendly trace in devtools.
    console.log(`Verdict: ${answer} (No button dodged ${noAttempts} time(s))`);
  }

  function shakeCard() {
    appCard.classList.add("is-shaking");
    setTimeout(() => appCard.classList.remove("is-shaking"), 520);
  }

  // ---------- Screen 4: confetti ----------
  function launchConfetti() {
    const ctx = confettiCanvas.getContext("2d");
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    confettiCanvas.style.display = "block";

    const colors = ["#FF6FB0", "#9D5CFF", "#5B4FE9", "#FFD23F", "#FF4D6D", "#FFFFFF"];
    const particles = Array.from({ length: 150 }, () => ({
      x: Math.random() * confettiCanvas.width,
      y: -30 - Math.random() * confettiCanvas.height * 0.4,
      size: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 2.6 + 2,
      speedX: Math.random() * 2.4 - 1.2,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 8 - 4,
      isRect: Math.random() > 0.45,
    }));

    let frame = 0;
    const totalFrames = 230;

    function tick() {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.isRect) {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      frame += 1;
      if (frame < totalFrames) {
        requestAnimationFrame(tick);
      } else {
        confettiCanvas.style.display = "none";
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      }
    }

    tick();
  }

  // ---------- Floating background emojis ----------
  function createFloatingEmojis() {
    const emojis = ["☕", "🍕", "🎬", "✨"];
    const count = 14;

    for (let i = 0; i < count; i += 1) {
      const span = document.createElement("span");
      span.className = "emoji-float";
      span.textContent = emojis[i % emojis.length];
      span.style.left = `${Math.random() * 92}%`;
      span.style.fontSize = `${1.3 + Math.random() * 1.2}rem`;
      span.style.animationDuration = `${12 + Math.random() * 10}s`;
      span.style.animationDelay = `${-Math.random() * 20}s`;
      emojiField.appendChild(span);
    }
  }

  // ---------- Wire it all up ----------
  function init() {
    createFloatingEmojis();
    runIntroSequence();
    bindNoButtonEvents();

    yesBtn.addEventListener("click", () => {
      showScreen(screenLoading);
      startFakeLoading();
    });

    window.addEventListener("resize", () => {
      if (confettiCanvas.style.display === "block") {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
      }
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
