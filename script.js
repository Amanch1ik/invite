// ── Обратный отсчёт до 9 августа, 14:00 (Бишкек, UTC+6) ──
const TARGET = new Date("2026-08-09T14:00:00+06:00").getTime();
const dEl = document.querySelector("[data-d]");
const hEl = document.querySelector("[data-h]");
const mEl = document.querySelector("[data-m]");
const sEl = document.querySelector("[data-s]");
const pad = (n) => String(n).padStart(2, "0");

function tick() {
  const diff = Math.max(0, TARGET - Date.now());
  const s = Math.floor(diff / 1000);
  dEl.textContent = pad(Math.floor(s / 86400));
  hEl.textContent = pad(Math.floor((s % 86400) / 3600));
  mEl.textContent = pad(Math.floor((s % 3600) / 60));
  sEl.textContent = pad(s % 60);
}
tick();
setInterval(tick, 1000);

// ── Падающие лепестки ──
const petals = document.getElementById("petals");
const N = window.matchMedia("(max-width: 480px)").matches ? 10 : 16;
for (let i = 0; i < N; i++) {
  const p = document.createElement("span");
  p.className = "petal";
  p.style.left = Math.random() * 100 + "vw";
  const size = 8 + Math.random() * 12;
  p.style.width = size + "px";
  p.style.height = size + "px";
  p.style.animationDuration = 7 + Math.random() * 8 + "s";
  p.style.animationDelay = -Math.random() * 12 + "s";
  p.style.opacity = 0.5 + Math.random() * 0.4;
  petals.appendChild(p);
}

// ── «Я приду» → подтверждение + сердечный залп ──
const yesBtn = document.getElementById("yes");
const done = document.getElementById("done");

yesBtn.addEventListener("click", () => {
  burst();
  setTimeout(() => done.classList.add("show"), 400);
});

function burst() {
  const hearts = ["❤️", "💕", "💖", "🥂", "🌹", "💘"];
  for (let i = 0; i < 34; i++) {
    const el = document.createElement("div");
    el.textContent = hearts[i % hearts.length];
    el.style.cssText =
      "position:fixed;z-index:30;pointer-events:none;left:" +
      (48 + Math.random() * 8) + "vw;top:78vh;font-size:" +
      (18 + Math.random() * 26) + "px;";
    document.body.appendChild(el);
    const dx = (Math.random() - 0.5) * 460;
    const dy = -(180 + Math.random() * 420);
    const rot = (Math.random() - 0.5) * 120;
    el.animate(
      [
        { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, opacity: 0 },
      ],
      { duration: 1600 + Math.random() * 900, easing: "cubic-bezier(0.2,0.8,0.3,1)" }
    );
    setTimeout(() => el.remove(), 2600);
  }
}
