const s1 = document.getElementById("s1");
const s2 = document.getElementById("s2");
const s3 = document.getElementById("s3");
const env = document.getElementById("env");
const yesBtn = document.getElementById("yes");
const noBtn = document.getElementById("no");

function show(el) {
  [s1, s2, s3].forEach((s) => s.classList.remove("active"));
  el.classList.add("active");
  // перезапустить pop-анимацию карточки
  const card = el.querySelector(".card");
  if (card) { card.classList.remove("pop"); void card.offsetWidth; card.classList.add("pop"); }
}

// ① Открыть конверт → вопрос
function openEnvelope() {
  if (env.classList.contains("open")) return;
  env.classList.add("open");
  setTimeout(() => show(s2), 900);
}
env.addEventListener("click", openEnvelope);
env.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") openEnvelope(); });

// ── Убегающая «Нет» + подколы ──
const TAUNTS = ["точно? 🥺", "подумай ещё 🐣", "ну пожалуйста 🙏", "я старался 💔", "не-а, жми Да 😌", "последний шанс 👀", "жестоко 😭"];
let taunt = 0, home = null, yesScale = 1;

function ensureHome() {
  if (home) return;
  const r = noBtn.getBoundingClientRect();
  home = { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
}
function dodge(px, py) {
  ensureHome();
  const r = noBtn.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  let dx = cx - px, dy = cy - py;
  const dist = Math.hypot(dx, dy) || 1;
  const push = 150, pad = 16;
  let tcx = cx + (dx / dist) * push;
  let tcy = cy + (dy / dist) * push;
  tcx = Math.min(innerWidth - r.width / 2 - pad, Math.max(r.width / 2 + pad, tcx));
  tcy = Math.min(innerHeight - r.height / 2 - pad, Math.max(r.height / 2 + pad, tcy));
  if (Math.hypot(tcx - px, tcy - py) < 90) {
    tcx = px < innerWidth / 2 ? innerWidth - r.width / 2 - pad : r.width / 2 + pad;
    tcy = pad + r.height / 2 + Math.random() * (innerHeight - r.height - 2 * pad);
  }
  noBtn.style.position = "fixed";
  noBtn.style.left = tcx - r.width / 2 + "px";
  noBtn.style.top = tcy - r.height / 2 + "px";
  noBtn.textContent = TAUNTS[taunt % TAUNTS.length];
  taunt++;
  yesScale = Math.min(1.7, yesScale + 0.08);
  yesBtn.style.transform = `scale(${yesScale})`;
}
let last = 0;
document.addEventListener("mousemove", (e) => {
  if (!s2.classList.contains("active")) return;
  const now = Date.now();
  if (now - last < 55) return;
  const r = noBtn.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  if (Math.hypot(cx - e.clientX, cy - e.clientY) < 110) { last = now; dodge(e.clientX, e.clientY); }
});
noBtn.addEventListener("touchstart", (e) => { e.preventDefault(); const t = e.touches[0]; dodge(t.clientX, t.clientY); }, { passive: false });

// ② «Да!» → детали + залп
yesBtn.addEventListener("click", () => {
  burst();
  setTimeout(() => show(s3), 350);
});

// ── Обратный отсчёт (мило) ──
const TARGET = new Date("2026-08-09T14:00:00+06:00").getTime();
const cd = document.querySelector("#cd b");
function tickCd() {
  const diff = TARGET - Date.now();
  if (diff <= 0) { cd.textContent = "сегодня! 🎉"; return; }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  cd.textContent = `${d} дн · ${h} ч · ${m} мин`;
}
tickCd();
setInterval(tickCd, 30000);

// ── Летающие сердечки на фоне ──
const hearts = document.getElementById("hearts");
const EMO = ["❤️", "💕", "💗", "💖", "🥰", "🌸"];
const N = matchMedia("(max-width: 480px)").matches ? 12 : 20;
for (let i = 0; i < N; i++) {
  const h = document.createElement("span");
  h.className = "hb";
  h.textContent = EMO[i % EMO.length];
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = 14 + Math.random() * 20 + "px";
  h.style.animationDuration = 7 + Math.random() * 8 + "s";
  h.style.animationDelay = -Math.random() * 14 + "s";
  hearts.appendChild(h);
}

// ── Залп сердечек/конфетти ──
function burst() {
  const emo = ["❤️", "💕", "💖", "🎉", "🥰", "💘", "✨"];
  for (let i = 0; i < 40; i++) {
    const el = document.createElement("div");
    el.textContent = emo[i % emo.length];
    el.style.cssText = "position:fixed;z-index:40;pointer-events:none;left:50vw;top:52vh;font-size:" + (16 + Math.random() * 26) + "px;";
    document.body.appendChild(el);
    const ang = Math.random() * Math.PI * 2;
    const rad = 120 + Math.random() * 320;
    el.animate(
      [
        { transform: "translate(-50%,-50%) scale(.4)", opacity: 1 },
        { transform: `translate(${Math.cos(ang) * rad - 50}%, ${Math.sin(ang) * rad - 50}%) scale(1.1)`, opacity: 0 },
      ],
      { duration: 1400 + Math.random() * 900, easing: "cubic-bezier(0.2,0.8,0.3,1)" }
    );
    setTimeout(() => el.remove(), 2400);
  }
}
