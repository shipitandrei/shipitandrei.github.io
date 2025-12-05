// ---------------------------
// Random lists
// ---------------------------
const goodThings = [
  "You get $1,000 instantly!",
  "You gain a superpower!",
  "You get free pizza for a year!",
  "You can skip homework today!"
];

const badThings = [
  "You must shout in public.",
  "You lose your favorite item.",
  "You have to clean your room.",
  "You can never eat chocolate again."
];

const redResponses = [
  "I would've picked that too!",
  "Bold choice!",
  "Respect. You took the risk!"
];

const noResponses = [
  "Playing it safe, I see.",
  "Interesting choice...",
  "I probably would've pressed it."
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---------------------------
// Elements
// ---------------------------
const titleText = document.getElementById("titleText");
const goodText = document.getElementById("goodText");
const badText = document.getElementById("badText");
const redBtn = document.getElementById("redBtn");
const noBtn = document.getElementById("noBtn");

// ---------------------------
// Hide UI
// ---------------------------
function hideGame() {
  titleText.style.display = "none";
  goodText.style.display = "none";
  badText.style.display = "none";
  redBtn.style.display = "none";
  noBtn.style.display = "none";
}

// ---------------------------
// Show center message
// ---------------------------
let currentMessageBox = null;

function showMessage(msg) {
  const box = document.createElement("div");
  box.textContent = msg;

  box.style.position = "absolute";
  box.style.top = "50%";
  box.style.left = "50%";
  box.style.transform = "translate(-50%, -50%)";
  box.style.fontSize = "26px";
  box.style.fontWeight = "bold";
  box.style.color = "white";
  box.style.textAlign = "center";
  box.style.maxWidth = "80%";

  document.body.appendChild(box);
  currentMessageBox = box;
}

// ---------------------------
// Reset UI for next round
// ---------------------------
function resetGame() {
  // Remove old message
  if (currentMessageBox) {
    currentMessageBox.remove();
    currentMessageBox = null;
  }

  // Pick NEW good/bad for the next round
  goodText.textContent = "Good thing: " + pick(goodThings);
  badText.textContent = "Bad thing: " + pick(badThings);

  // Reveal UI again
  titleText.style.display = "block";
  goodText.style.display = "block";
  badText.style.display = "block";
  redBtn.style.display = "block";
  noBtn.style.display = "block";
}

// ---------------------------
// Button logic
// ---------------------------
function handleChoice(responseList) {
  hideGame();
  showMessage(pick(responseList));

  // 3.5-second wait → then new round
  setTimeout(resetGame, 3500);
}

redBtn.addEventListener("click", () => {
  handleChoice(redResponses);
});

noBtn.addEventListener("click", () => {
  handleChoice(noResponses);
});
