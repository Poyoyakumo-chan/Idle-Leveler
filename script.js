const levelEl = document.getElementById("level");
const xpEl = document.getElementById("xp");
const gainBtn = document.getElementById("gainBtn");
const messageEl = document.getElementById("message");

let state = {
  level: 1,
  xp: 0,
  xpToNext: 10,
  autoXP: 1, // 1秒ごとに増える経験値
};

// 保存・復元
if (localStorage.getItem("idleGameState")) {
  state = JSON.parse(localStorage.getItem("idleGameState"));
  updateStats();
}

// 手動で経験値を得る
gainBtn.addEventListener("click", () => {
  addXP(1);
});

// 放置で経験値加算
setInterval(() => {
  addXP(state.autoXP);
}, 1000);

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
    messageEl.textContent = `レベルアップ！レベル ${state.level} 🎉`;
    setTimeout(() => messageEl.textContent = "", 2000);
  }
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
