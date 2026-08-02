// ── Ретро-звуки (Howler) ──
const SFX = {
  pop: new Howl({ src: ["sfx/pop.wav"], volume: 0.55 }),
  click: new Howl({ src: ["sfx/click.wav"], volume: 0.5 }),
  yay: new Howl({ src: ["sfx/yay.wav"], volume: 0.6 }),
  type: new Howl({ src: ["sfx/type.wav"], volume: 0.4 }),
};

// ── Музыка: Lana Del Rey — Young and Beautiful (YouTube, с авто-фолбэком) ──
// Официальный клип запрещает встраивание — пробуем список, пока не заиграет.
const SONG_IDS = ["o_1aF54DO60", "mjcX-5lKdeg", "qNuyGynRQpk", "79c2pSvz8IE", "Te11UaHOHMQ", "y76wnKGKNEY"];
const SONG_START = 60; // эпичный момент — вход в припев «Will you still love me…»
let songIdx = 0;
let ytPlayer = null, ytReady = false, wantPlay = false, muted = false, started = false;

window.onYouTubeIframeAPIReady = function () {
  ytPlayer = new YT.Player("yt", {
    videoId: SONG_IDS[0],
    playerVars: { autoplay: 0, controls: 0, playsinline: 1, rel: 0, start: SONG_START },
    events: {
      onReady: () => { ytReady = true; if (wantPlay) playSong(); },
      onError: () => tryNext(),
    },
  });
};
function applyVol() {
  try { if (muted) ytPlayer.mute(); else { ytPlayer.unMute(); ytPlayer.setVolume(55); } } catch (e) {}
}
function playSong() {
  started = true;
  if (!ytReady) { wantPlay = true; return; }
  try { applyVol(); ytPlayer.playVideo(); } catch (e) {}
}
function tryNext() {
  if (songIdx < SONG_IDS.length - 1) {
    songIdx++;
    try { ytPlayer.loadVideoById({ videoId: SONG_IDS[songIdx], startSeconds: SONG_START }); applyVol(); } catch (e) {}
  }
}

// Кнопка звука: тап запускает песню (жест) + мьютит всё
const muteBtn = document.getElementById("mute");
muteBtn.addEventListener("click", () => {
  if (!started) { playSong(); muted = false; }
  else { muted = !muted; }
  Howler.mute(muted);
  if (ytPlayer) { muted ? ytPlayer.mute() : ytPlayer.unMute(); }
  muteBtn.textContent = muted ? "🔇" : "🔊";
});

// ── Летающие сердечки (tsParticles) ──
tsParticles.load({
  id: "tsp",
  options: {
    fullScreen: { enable: true, zIndex: 0 },
    detectRetina: true,
    particles: {
      number: { value: 22 },
      shape: { type: "emoji", options: { emoji: { value: ["❤️", "💕", "💗", "💖", "🥰"] } } },
      size: { value: { min: 9, max: 20 } },
      opacity: { value: { min: 0.4, max: 0.85 } },
      move: { enable: true, direction: "top", speed: 1.1, straight: false, outModes: { default: "out" } },
      rotate: { value: { min: 0, max: 360 }, animation: { enable: true, speed: 6, sync: false } },
    },
  },
});

// ── Элементы ──
const envelope = document.getElementById("envelope-container");
const letter = document.getElementById("letter-container");
const win = document.querySelector(".letter-window");
const title = document.getElementById("letter-title");
const catImg = document.getElementById("letter-cat");
const buttons = document.getElementById("letter-buttons");
const finalText = document.getElementById("final-text");
const noBtn = document.querySelector(".no-btn");
const yesBtn = document.querySelector(".btn[alt='Yes']");

gsap.set([catImg, buttons], { opacity: 0, scale: 0.6 });
gsap.set(win, { opacity: 0, scale: 0.7 });

// ── Свой типописатель со звуком печати на каждый символ ──
function typeWriter(el, html, speed, onDone) {
  const tokens = html.split(/(<br\s*\/?>)/i).filter(Boolean);
  el.innerHTML = "";
  let ti = 0;
  (function nextToken() {
    if (ti >= tokens.length) { onDone && onDone(); return; }
    const tok = tokens[ti++];
    if (/^<br/i.test(tok)) { el.innerHTML += "<br>"; setTimeout(nextToken, 240); return; }
    let ci = 0;
    (function nextChar() {
      if (ci >= tok.length) { setTimeout(nextToken, 0); return; }
      const ch = tok[ci++];
      el.innerHTML += ch;
      if (ch !== " ") SFX.type.play();
      setTimeout(nextChar, speed);
    })();
  })();
}

// ── ① Клик по конверту → музыка + элементы по очереди ──
let opened = false;
function openLetter() {
  if (opened) return;
  opened = true;
  playSong();
  SFX.pop.play();

  gsap.to("#envelope", { scale: 1.2, duration: 0.15, yoyo: true, repeat: 1 });
  gsap.to(envelope, {
    opacity: 0, scale: 0.6, duration: 0.4, delay: 0.2,
    onComplete: () => { envelope.style.display = "none"; },
  });

  letter.style.display = "flex";
  const tl = gsap.timeline({ delay: 0.45 });
  tl.to(win, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.6)" });
  tl.to(catImg, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)", onStart: () => SFX.pop.play() }, "+=0.1");
  tl.add(() => {
    typeWriter(title, "Приглашаю тебя<br>в одно местечко…", 60, () => {
      gsap.to(buttons, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2.2)", onStart: () => SFX.pop.play() });
    });
  }, "+=0.2");
}
envelope.addEventListener("click", openLetter);

// ── «Нет» убегает (с ретро-щелчком) ──
function moveNo() {
  SFX.click.play();
  const d = 170 + Math.random() * 90, a = Math.random() * Math.PI * 2;
  gsap.to(noBtn, { x: Math.cos(a) * d, y: Math.sin(a) * d, duration: 0.3, ease: "power2.out" });
  const cur = gsap.getProperty(yesBtn, "scale") || 1;
  gsap.to(yesBtn, { scale: Math.min(1.6, cur + 0.12), duration: 0.25, ease: "back.out(2)" });
}
noBtn.addEventListener("mouseover", moveNo);
noBtn.addEventListener("touchstart", (e) => { e.preventDefault(); moveNo(); }, { passive: false });

// ── «Да» → фанфары + детали по одной (в такт) ──
yesBtn.addEventListener("click", () => {
  SFX.yay.play();
  celebrate();
  title.textContent = "Урааа! 🎉";
  catImg.src = "cat_dance.gif";
  win.classList.add("final");
  gsap.to(buttons, { opacity: 0, scale: 0.6, duration: 0.3, onComplete: () => (buttons.style.display = "none") });

  // Полароид «это мы» — влетает с наклоном
  const pol = document.getElementById("polaroid");
  if (pol) {
    pol.style.display = "block";
    gsap.fromTo(pol, { y: -200, rotation: -22, opacity: 0 }, { y: 0, rotation: -6, opacity: 1, duration: 0.85, ease: "back.out(1.4)", delay: 0.35 });
  }

  finalText.style.display = "block";
  const items = finalText.querySelectorAll(".ri");
  gsap.set(items, { opacity: 0, y: 22, scale: 0.8 });
  items.forEach((el, i) => {
    gsap.to(el, {
      opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(2.2)",
      delay: 0.6 + i * 0.4,
      onStart: () => SFX.pop.play(),
    });
  });
});

// ── Конфетти ──
function celebrate() {
  const heart = confetti.shapeFromText ? confetti.shapeFromText({ text: "❤️", scalar: 2 }) : undefined;
  const base = { origin: { y: 0.55 } };
  confetti({ ...base, particleCount: 90, spread: 75, startVelocity: 45 });
  if (heart) confetti({ ...base, particleCount: 30, spread: 100, scalar: 2, shapes: [heart] });
  let n = 0;
  const iv = setInterval(() => {
    confetti({ particleCount: 24, spread: 65, origin: { x: Math.random(), y: 0.3 + Math.random() * 0.3 } });
    if (++n > 4) clearInterval(iv);
  }, 320);
}

// ── След из сердечек за курсором ──
const TRAIL = ["💗", "❤️", "💕", "💖", "🩷"];
let lastTrail = 0;
function trail(x, y) {
  const now = Date.now();
  if (now - lastTrail < 45) return;
  lastTrail = now;
  const el = document.createElement("div");
  el.className = "trail-heart";
  el.textContent = TRAIL[(Math.random() * TRAIL.length) | 0];
  el.style.left = x + "px";
  el.style.top = y + "px";
  el.style.fontSize = 10 + Math.random() * 10 + "px";
  document.body.appendChild(el);
  const dx = (Math.random() - 0.5) * 26;
  const dy = 18 + Math.random() * 22;
  el.animate(
    [
      { transform: "translate(-50%,-50%) scale(1)", opacity: 0.9 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.3)`, opacity: 0 },
    ],
    { duration: 750 + Math.random() * 300, easing: "ease-out" }
  );
  setTimeout(() => el.remove(), 1100);
}
document.addEventListener("mousemove", (e) => trail(e.clientX, e.clientY));
document.addEventListener("touchmove", (e) => { const t = e.touches[0]; if (t) trail(t.clientX, t.clientY); }, { passive: true });

// ── Котик-мурлыка: гладишь → вздрагивает, сердечки и «мрр~» ──
const PURR = ["мрр~", "мур", "♡", "~♪", "мяу"];
let lastPet = 0;
function petCat() {
  const now = Date.now();
  if (now - lastPet < 130) return;
  lastPet = now;
  gsap.fromTo(catImg, { rotation: -5 }, { rotation: 5, duration: 0.11, yoyo: true, repeat: 1, ease: "sine.inOut", onComplete: () => gsap.to(catImg, { rotation: 0, duration: 0.1 }) });
  const r = catImg.getBoundingClientRect();
  const hx = r.left + r.width * (0.3 + Math.random() * 0.4);
  const hy = r.top + r.height * 0.18;
  const h = document.createElement("div");
  h.className = "cat-heart";
  h.textContent = ["💗", "💕", "❤️", "🥰"][(Math.random() * 4) | 0];
  h.style.left = hx + "px"; h.style.top = hy + "px";
  h.style.fontSize = 14 + Math.random() * 10 + "px";
  document.body.appendChild(h);
  const dx = (Math.random() - 0.5) * 44;
  h.animate(
    [
      { transform: "translate(-50%,-50%) scale(0.5)", opacity: 1 },
      { transform: `translate(calc(-50% + ${dx}px), -80px) scale(1.1)`, opacity: 0 },
    ],
    { duration: 900 + Math.random() * 400, easing: "ease-out" }
  );
  setTimeout(() => h.remove(), 1400);
  if (Math.random() < 0.3) {
    const b = document.createElement("div");
    b.className = "purr";
    b.textContent = PURR[(Math.random() * PURR.length) | 0];
    b.style.left = r.left + r.width / 2 + "px";
    b.style.top = r.top + 4 + "px";
    document.body.appendChild(b);
    b.animate(
      [
        { transform: "translate(-50%,0) scale(0.8)", opacity: 0 },
        { transform: "translate(-50%,-24px) scale(1)", opacity: 1, offset: 0.3 },
        { transform: "translate(-50%,-46px) scale(1)", opacity: 0 },
      ],
      { duration: 1100, easing: "ease-out" }
    );
    setTimeout(() => b.remove(), 1300);
  }
}
catImg.addEventListener("mousemove", petCat);
catImg.addEventListener("click", petCat);
catImg.addEventListener("touchstart", (e) => { e.preventDefault(); petCat(); }, { passive: false });
