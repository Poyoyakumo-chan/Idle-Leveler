const levelEl = document.getElementById("level");
const xpEl = document.getElementById("xp");
const gainBtn = document.getElementById("gainBtn");
const messageEl = document.getElementById("message");
const character = document.getElementById("character");
const particleCanvas = document.getElementById("particleCanvas");
const ctx = particleCanvas.getContext("2d");

let state = {
  level: 1,
  xp: 0,
  xpToNext: 10,
  autoXP: 1,
};

// 保存・復元
if (localStorage.getItem("idleGameState")) {
  state = JSON.parse(localStorage.getItem("idleGameState"));
  updateStats();
}

// パーティクル管理
let particles = [];

function spawnParticles() {
  for (let i = 0; i < 15; i++) {
    particles.push({
      x: 75,
      y: 75,
      dx: (Math.random() - 0.5) * 4,
      dy: (Math.random() - 1.5) * 4,
      alpha: 1,
      radius: Math.random() * 3 + 2,
      color: `hsl(${Math.random() * 360}, 80%, 60%)`
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
  particles.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
    ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
    ctx.fill();
    ctx.closePath();
    p.x += p.dx;
    p.y += p.dy;
    p.alpha -= 0.03;
    if (p.alpha <= 0) particles.splice(i,1);
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

// 手動で経験値を得る
gainBtn.addEventListener("click", () => addXP(1));

// 放置で経験値加算
setInterval(() => addXP(state.autoXP), 1000);

// 経験値追加
function addXP(amount) {
  state.xp += amount;
  checkLevelUp();
  updateStats();
  saveState();
}

// レベルアップ判定
function checkLevelUp() {
  if (state.xp >= state.xpToNext) {
    state.xp -= state.xpToNext;
    state.level++;
    state.xpToNext = Math.floor(state.xpToNext * 1.5);
    levelUpAnimation();
    messageEl.textContent = `レベルアップ！レベル ${state.level} 🎉`;
    spawnParticles();
    setTimeout(() => messageEl.textContent = "", 2000);
  }
}

// レベルアップ演出
function levelUpAnimation() {
  character.style.transform = "scale(1.5)";
  setTimeout(() => {
    character.style.transform = "scale(1)";
  }, 500);
}

// 画面更新
function updateStats() {
  levelEl.textContent = `レベル: ${state.level}`;
  xpEl.textContent = `経験値: ${state.xp} / ${state.xpToNext}`;
}

// 状態保存
function saveState() {
  localStorage.setItem("idleGameState", JSON.stringify(state));
}
