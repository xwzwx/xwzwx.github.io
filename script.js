const CONFIG = {
  name: "BigHeart",
  typeLines: [
    "The bigger the heart, the brighter the celebration.",
    "Today is for wild laughter, warm memories, and heroic amounts of cake.",
    "May your next chapter be kind, exciting, peaceful, and beautifully yours."
  ],
  giftMessages: [
    "Surprise unlocked: unlimited hugs, premium laughter, one imaginary crown, and lifetime access to our favorite memories.",
    "Definitely not socks. It is a full year of bold adventures, good people, clear wins, and ridiculous happiness.",
    "Inside the box: proof that someone with a heart this big deserves a celebration this bright."
  ],
  wishes: [
    "May the dreams you carry quietly begin opening loud, beautiful doors.",
    "May this year give you peaceful mornings, exciting wins, loyal people, and unforgettable nights.",
    "May every bit of kindness you give return to you in ways bigger than expected."
  ],
  jokes: [
    "Birthday calories have been temporarily disabled. The cake council approved it.",
    "You are not getting older. You are becoming a rare collector's edition.",
    "Scientists confirm that people with more birthdays usually live longer. Excellent work."
  ],
  truths: [
    "Truth detected: 100% heart, 999% legend, and absolutely no ordinary energy.",
    "Truth detected: BigHeart makes ordinary days feel like favorite memories.",
    "Truth detected: main-character energy with an unusually kind plot twist."
  ]
};

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

/* Background stars, sparks, and balloons */
(function createAtmosphere() {
  const stars = $("#stars");
  const sparkles = $("#sparkles");
  const balloons = $("#balloons");
  const starCount = window.innerWidth < 700 ? 48 : 90;
  const sparkCount = window.innerWidth < 700 ? 12 : 24;
  const balloonCount = window.innerWidth < 700 ? 5 : 9;
  const colors = ["#ff67c8", "#6ef3ff", "#ffd86b", "#a987ff", "#ff8c8c"];

  for (let i = 0; i < starCount; i += 1) {
    const star = document.createElement("span");
    star.className = "star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty("--d", `${1.8 + Math.random() * 3.8}s`);
    star.style.setProperty("--delay", `${-Math.random() * 4}s`);
    const size = 1 + Math.random() * 2.5;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    stars.appendChild(star);
  }

  for (let i = 0; i < sparkCount; i += 1) {
    const spark = document.createElement("span");
    spark.className = "spark";
    spark.style.left = `${Math.random() * 100}%`;
    spark.style.top = `${20 + Math.random() * 78}%`;
    spark.style.setProperty("--d", `${4 + Math.random() * 6}s`);
    spark.style.setProperty("--delay", `${-Math.random() * 6}s`);
    spark.style.color = colors[i % colors.length];
    sparkles.appendChild(spark);
  }

  for (let i = 0; i < balloonCount; i += 1) {
    const balloon = document.createElement("span");
    balloon.className = "balloon";
    balloon.style.left = `${Math.random() * 96}%`;
    balloon.style.setProperty("--c", colors[i % colors.length]);
    balloon.style.setProperty("--d", `${13 + Math.random() * 9}s`);
    balloon.style.setProperty("--delay", `${-Math.random() * 15}s`);
    balloon.style.setProperty("--sway", `${-45 + Math.random() * 90}px`);
    balloons.appendChild(balloon);
  }
})();

/* Typewriter */
const typeLine = $("#typeLine");
let typeLineIndex = 0;
let typeCharIndex = 0;
let deleting = false;
function typeLoop() {
  const current = CONFIG.typeLines[typeLineIndex];
  typeCharIndex += deleting ? -1 : 1;
  typeLine.textContent = current.slice(0, Math.max(0, typeCharIndex));

  if (!deleting && typeCharIndex >= current.length) {
    deleting = true;
    window.setTimeout(typeLoop, 1350);
    return;
  }
  if (deleting && typeCharIndex <= 0) {
    deleting = false;
    typeLineIndex = (typeLineIndex + 1) % CONFIG.typeLines.length;
  }
  window.setTimeout(typeLoop, deleting ? 28 : 48);
}
typeLoop();

/* Confetti engine */
const canvas = $("#confettiCanvas");
const ctx = canvas.getContext("2d");
const pieces = [];
let confettiFrame = null;
const confettiColors = ["#ff67c8", "#6ef3ff", "#ffd86b", "#a987ff", "#ffffff", "#78f2b6"];

function sizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}
sizeCanvas();
window.addEventListener("resize", sizeCanvas, { passive: true });

function burstConfetti(count = 130, originX = window.innerWidth / 2, originY = window.innerHeight * 0.28) {
  if (reducedMotion) return;
  for (let i = 0; i < Math.min(count, 420); i += 1) {
    const angle = -Math.PI / 2 + (Math.random() - .5) * 1.75;
    const speed = 7 + Math.random() * 11;
    pieces.push({
      x: originX + (Math.random() - .5) * 50,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      gravity: .2 + Math.random() * .13,
      drag: .991,
      w: 5 + Math.random() * 7,
      h: 7 + Math.random() * 10,
      r: Math.random() * Math.PI,
      vr: (Math.random() - .5) * .32,
      color: randomItem(confettiColors),
      life: 0,
      ttl: 100 + Math.random() * 75
    });
  }
  if (!confettiFrame) drawConfetti();
}

function drawConfetti() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (let i = pieces.length - 1; i >= 0; i -= 1) {
    const p = pieces[i];
    p.vx *= p.drag;
    p.vy = p.vy * p.drag + p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.r += p.vr;
    p.life += 1;
    ctx.save();
    ctx.globalAlpha = Math.max(0, 1 - p.life / p.ttl);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.r);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
    if (p.life > p.ttl || p.y > window.innerHeight + 40) pieces.splice(i, 1);
  }
  if (pieces.length) confettiFrame = requestAnimationFrame(drawConfetti);
  else {
    confettiFrame = null;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

/* Toast and happiness meter */
const toast = $("#toast");
const happyMeter = $("#happyMeter");
const happyValue = $("#happyValue");
let happiness = 72;
let toastTimer;
function showToast(text) {
  toast.textContent = text;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2500);
}
function addHappiness(amount) {
  happiness = Math.min(100, happiness + amount);
  happyMeter.style.width = `${happiness}%`;
  happyValue.textContent = `${happiness}%`;
}

/* Gift */
const giftCard = $("#giftCard");
const gift = $("#gift");
const giftText = $("#giftText");
function openGift() {
  gift.classList.toggle("is-open");
  giftText.textContent = randomItem(CONFIG.giftMessages);
  burstConfetti(150, giftCard.getBoundingClientRect().left + giftCard.offsetWidth * .35, giftCard.getBoundingClientRect().top + giftCard.offsetHeight * .45);
  addHappiness(8);
  playMelody([523.25, 659.25, 783.99, 1046.5], .14);
}
giftCard.addEventListener("click", openGift);
giftCard.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openGift();
  }
});

/* Candles */
const candles = $$(".candle");
const candleText = $("#candleText");
let blownCandles = 0;
candles.forEach((candle) => {
  candle.addEventListener("click", () => {
    if (candle.classList.contains("is-out")) return;
    candle.classList.add("is-out");
    blownCandles += 1;
    const remaining = candles.length - blownCandles;
    if (remaining) {
      candleText.textContent = `${remaining} candle${remaining === 1 ? "" : "s"} left. Your wish is getting closer.`;
      playMelody([783.99], .12);
    } else {
      candleText.textContent = "Wish unlocked: may life return every bit of warmth BigHeart gives away.";
      burstConfetti(260);
      addHappiness(15);
      playMelody([523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5], .15);
      showToast("The universe accepted BigHeart's birthday wish ✨");
    }
  });
});

/* Message buttons */
const messageText = $("#messageText");
const messageIcon = $("#messageIcon");
const icons = { wish: "🌟", joke: "😂", truth: "🔎" };
const pools = { wish: CONFIG.wishes, joke: CONFIG.jokes, truth: CONFIG.truths };
$$("[data-message]").forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.dataset.message;
    messageText.textContent = randomItem(pools[type]);
    messageIcon.textContent = icons[type];
    addHappiness(type === "joke" ? 4 : 3);
    if (type === "wish") burstConfetti(55);
  });
});

/* Scanner */
const scanBtn = $("#scanBtn");
const scannerFill = $("#scannerFill");
const scannerText = $("#scannerText");
const scanResults = [
  "Result: 100% heart. 999% legend.",
  "Result: kindness levels exceed safe limits.",
  "Result: officially too awesome for an ordinary birthday.",
  "Result: main-character energy confirmed."
];
scanBtn.addEventListener("click", () => {
  scannerText.textContent = "Scanning BigHeart...";
  scannerFill.style.width = "100%";
  scanBtn.disabled = true;
  window.setTimeout(() => {
    scannerText.textContent = randomItem(scanResults);
    scannerFill.style.width = `${82 + Math.floor(Math.random() * 18)}%`;
    scanBtn.disabled = false;
    addHappiness(5);
    burstConfetti(45, scanBtn.getBoundingClientRect().left, scanBtn.getBoundingClientRect().top);
  }, 900);
});

/* Surprise dialog */
const dialog = $("#surpriseDialog");
function showSurprise() {
  dialog.showModal();
  burstConfetti(220);
  playMelody([392, 392, 440, 392, 523.25, 493.88], .19);
}
$("#surpriseBtn").addEventListener("click", showSurprise);
$("#closeDialog").addEventListener("click", () => dialog.close());
$("#dialogConfetti").addEventListener("click", () => {
  burstConfetti(320);
  addHappiness(10);
});
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

$("#confettiBtn").addEventListener("click", () => {
  burstConfetti(250);
  addHappiness(7);
  showToast("Confetti budget officially exceeded 🎉");
});

/* Sound and party mode */
let audioContext;
function playTone(frequency, duration, start, volume = .035) {
  audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + .015);
  gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + .03);
}
function playMelody(notes = [392, 392, 440, 392, 523.25, 493.88, 392, 392, 440, 392, 587.33, 523.25], spacing = .18) {
  audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
  const start = audioContext.currentTime + .03;
  notes.forEach((note, index) => playTone(note, spacing * 1.4, start + index * spacing));
}
const soundBtn = $("#soundBtn");
soundBtn.addEventListener("click", () => {
  playMelody();
  soundBtn.setAttribute("aria-pressed", "true");
  window.setTimeout(() => soundBtn.setAttribute("aria-pressed", "false"), 2400);
  showToast("Birthday melody playing for BigHeart ♫");
});

const partyBtn = $("#partyBtn");
partyBtn.addEventListener("click", () => {
  const active = !document.body.classList.contains("party-mode");
  document.body.classList.toggle("party-mode", active);
  partyBtn.setAttribute("aria-pressed", String(active));
  if (active) {
    burstConfetti(300);
    playMelody([523.25, 659.25, 783.99, 1046.5, 1174.66, 1046.5], .13);
    showToast("Party mode activated. Ordinary behavior cancelled ⚡");
    window.setTimeout(() => {
      document.body.classList.remove("party-mode");
      partyBtn.setAttribute("aria-pressed", "false");
    }, 7000);
  }
});

/* Secret easter egg */
$("#secretBtn").addEventListener("click", () => {
  showToast("Secret unlocked: BigHeart makes ordinary days feel like favorite memories 💛");
  burstConfetti(180);
  playMelody([523.25, 659.25, 783.99, 1046.5, 783.99, 659.25], .14);
  addHappiness(12);
});

/* Gentle parallax */
if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
  const world = $("#world");
  world.addEventListener("pointermove", (event) => {
    const x = (event.clientX / window.innerWidth - .5) * 12;
    const y = (event.clientY / window.innerHeight - .5) * 12;
    $(".hero").style.transform = `translate3d(${x * .08}px, ${y * .08}px, 0)`;
    $(".playground").style.transform = `translate3d(${-x * .06}px, ${-y * .06}px, 0)`;
    $(".aurora--one").style.translate = `${-x * .8}px ${-y * .8}px`;
    $(".aurora--two").style.translate = `${x * .75}px ${-y * .65}px`;
  });
}

/* Opening celebration */
window.addEventListener("load", () => {
  window.setTimeout(() => burstConfetti(150), 550);
});
