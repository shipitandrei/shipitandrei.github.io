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

// Helper: pick random
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---------------------------
// Grab elements
// ---------------------------
const titleText = document.getElementById("titleText");
const goodText = document.getElementById("goodText");
const badText = document.getElementById("badText");
const redBtn = document.getElementById("redBtn");
const noBtn = document.getElementById("noBtn");

// Safety check
if (!titleText || !goodText || !badText || !redBtn || !noBtn) {
  console.error("❌ One or more required IDs are missing from the HTML.");
}

// ---------------------------
// Hide all main elements
// ---------------------------
function hideGame() {
  titleText.style.display = "none";
  goodText.style.display = "none";
  badText.style.display = "none";
  redBtn.style.display = "none";
  noBtn.style.display = "none";
}

// ---------------------------
// Show response in center
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

  document.body.appendChild(box);
}

// ---------------------------
// Button click events
// ---------------------------
redBtn.addEventListener("click", () => {
  // Update text for the next round (even though it hides after)
  goodText.textContent = "Good thing: " + pick(goodThings);
  badText.textContent = "Bad thing: " + pick(badThings);

  hideGame();
  showMessage(pick(redResponses));
});

noBtn.addEventListener("click", () => {
  hideGame();
  showMessage(pick(noResponses));
});
