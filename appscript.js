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

// Pick random item
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
// Stats tracking
// ---------------------------
let rounds = 0;
let pressed = 0;
let notPressed = 0;

let currentMessageBox = null;

// ---------------------------
// Hide UI
// ---------------------------
function hideGame() {
  titleText.style.opacity = "0";
  goodText.style.opacity = "0";
  badText.style.opacity = "0";
  redBtn.style.opacity = "0";
  noBtn.style.opacity = "0";
}

// ---------------------------
// Show response message
// ---------------------------
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
  box.style.zIndex = "9999";

  document.body.appendChild(box);
  currentMessageBox = box;
}

// ---------------------------
// Reset UI for next round
// ---------------------------
function resetGame() {
  if (currentMessageBox) {
    currentMessageBox.remove();
    currentMessageBox = null;
  }

  // Randomize next question
  goodText.textContent = "Good thing: " + pick(goodThings);
  badText.textContent = "Bad thing: " + pick(badThings);

  // Show everything again
  titleText.style.opacity = "1";
  goodText.style.opacity = "1";
  badText.style.opacity = "1";
  redBtn.style.opacity = "1";
  noBtn.style.opacity = "1";
}

// ---------------------------
// Stats screen
// ---------------------------
function showStats() {
  // Hide everything permanently
  titleText.remove();
  goodText.remove();
  badText.remove();
  redBtn.remove();
  noBtn.remove();

  if (currentMessageBox) currentMessageBox.remove();

  const statsBox = document.createElement("div");
  statsBox.innerHTML = `
    <p style="font-size:28px;font-weight:bold;margin-bottom:20px;text-align:center;">
      Your Results
    </p>
    <p style="font-size:22px;text-align:center;">You pressed the button <b>${pressed}</b> times.</p>
    <p style="font-size:22px;text-align:center;">You didn’t press it <b>${notPressed}</b> times.</p>
  `;

  statsBox.style.position = "absolute";
  statsBox.style.top = "50%";
  statsBox.style.left = "50%";
  statsBox.style.transform = "translate(-50%, -50%)";
  statsBox.style.color = "white";
  statsBox.style.textAlign = "center";
  statsBox.style.maxWidth = "90%";
  statsBox.style.zIndex = "9999";

  document.body.appendChild(statsBox);
}

// ---------------------------
// Button logic
// ---------------------------
function choose(responseList, type) {
  rounds++;

  if (type === "press") pressed++;
  else notPressed++;

  hideGame();
  showMessage(pick(responseList));

  // After 10 rounds → show stats instead of next round
  if (rounds >= 10) {
    setTimeout(showStats, 3500);
  } else {
    setTimeout(resetGame, 3500);
  }
}

redBtn.addEventListener("click", () => {
  choose(redResponses, "press");
});

noBtn.addEventListener("click", () => {
  choose(noResponses, "no");
});
