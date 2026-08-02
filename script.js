// Элементы
const envelope = document.getElementById("envelope-container");
const letter = document.getElementById("letter-container");
const noBtn = document.querySelector(".no-btn");
const yesBtn = document.querySelector(".btn[alt='Yes']");

const title = document.getElementById("letter-title");
const catImg = document.getElementById("letter-cat");
const buttons = document.getElementById("letter-buttons");
const finalText = document.getElementById("final-text");

// Клик по конверту
envelope.addEventListener("click", () => {
  envelope.style.display = "none";
  letter.style.display = "flex";

  setTimeout(() => {
    document.querySelector(".letter-window").classList.add("open");
  }, 50);
});

// «Нет» убегает
noBtn.addEventListener("mouseover", moveNo);
noBtn.addEventListener("touchstart", (e) => { e.preventDefault(); moveNo(); }, { passive: false });

function moveNo() {
  const distance = 180 + Math.random() * 80;
  const angle = Math.random() * Math.PI * 2;
  const moveX = Math.cos(angle) * distance;
  const moveY = Math.sin(angle) * distance;
  noBtn.style.transition = "transform 0.3s ease";
  noBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
}

// «Да» нажата
yesBtn.addEventListener("click", () => {
  title.textContent = "Урааа! 🎉";
  catImg.src = "cat_dance.gif";
  document.querySelector(".letter-window").classList.add("final");
  buttons.style.display = "none";
  finalText.style.display = "block";
  hearts();
});

// Залп сердечек
function hearts() {
  const emo = ["❤️", "💕", "💖", "🎉", "🥰", "💛"];
  for (let i = 0; i < 32; i++) {
    const el = document.createElement("div");
    el.textContent = emo[i % emo.length];
    el.style.cssText = "position:fixed;z-index:50;pointer-events:none;left:50vw;top:52vh;font-size:" + (16 + Math.random() * 24) + "px;";
    document.body.appendChild(el);
    const ang = Math.random() * Math.PI * 2;
    const rad = 130 + Math.random() * 300;
    el.animate(
      [
        { transform: "translate(-50%,-50%) scale(.4)", opacity: 1 },
        { transform: `translate(${Math.cos(ang) * rad - 50}%, ${Math.sin(ang) * rad - 50}%) scale(1.1)`, opacity: 0 },
      ],
      { duration: 1500 + Math.random() * 800, easing: "cubic-bezier(0.2,0.8,0.3,1)" }
    );
    setTimeout(() => el.remove(), 2400);
  }
}
