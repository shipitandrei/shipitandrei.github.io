// -------------- RANDOM LISTS --------------
const goodThings = [
  "You get $1,000 instantly!",
  "You gain a superpower!",
  "You get free pizza for a year!",
  "You can skip homework today!"
];

const badThings = [
  "You must shout in public!",
  "You lose your favorite item!",
  "You have to clean your room!",
  "You can never eat chocolate again!"
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

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// -------------- GET ELEMENTS SAFELY --------------
const redBtn = document.getElementById("redBtn");
const noBtn  = document.getElementById("noBtn");
const goodText = document.getElementById("goodText");
const badText = document.getElementById("badText");
const titleText = document.getElementById("titleText");

// If ANY of these are missing, show a helpful error.
if (!redBtn || !noBtn || !goodText || !badText || !titleText) {
  console.error("❌ Missing HTML IDs. Make sure your HTML matches the required IDs.");
}

// -------------- HIDE ALL GAME ELEMENTS --------------
function hideGame() {
  redBtn.style.display = "none";
  noBtn.style.display = "none";
  goodText.style.display = "none";
  badText.style.display = "none";
  titleText.style.display = "none";
}

// -------------- SHOW RESPONSE MESSAGE CENTERED --------------
function showMessage(msg) {
  const box = document.createElement("div");
  box.textContent = msg;
  box.style.position = "absolute";
  box.style.top = "50%";
  box.style.left = "50%";
  box.style.transform = "translate(-50%, -50%)";
  box.style.fontSize = "24px";
  box.style.fontWeight = "bold";
  box.style.color = "white";
  box.style.textAlign = "center";
  document.body.appendChild(box);
}

// -------------- BUTTON HANDLERS --------------
redBtn.addEventListener("click", () => {
  hideGame();
  showMessage( pick(redResponses) );
});

noBtn.addEventListener("click", () => {
  hideGame();
  showMessage( pick(noResponses) );
});
