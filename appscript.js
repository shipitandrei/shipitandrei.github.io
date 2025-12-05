// =========================
// CONFIGURATION
// =========================
const totalRounds = 10;
const fadeDuration = 400; // milliseconds
const messageDelay = 1000; // time message stays visible

// =========================
// ELEMENTS
// =========================
const titleText = document.getElementById("titleText");
const goodText = document.getElementById("goodText");
const badText = document.getElementById("badText");
const redBtn = document.getElementById("redBtn");
const noBtn = document.getElementById("noBtn");

// =========================
// DATA
// =========================
let currentRound = 1;
let pressedCount = 0;
let notPressedCount = 0;

const rounds = [
  { good: "You get $1,000 instantly!", bad: "You must shout in public." },
  { good: "Free pizza for life!", bad: "You can never eat burgers again." },
  { good: "Unlimited WiFi anywhere.", bad: "Battery always stuck at 10%." },
  { good: "You gain super strength.", bad: "You lose 1 hour of sleep daily." },
  { good: "Instantly finish all homework.", bad: "Teacher gives a random quiz." },
  { good: "You become a genius.", bad: "Everyone thinks you’re weird." },
  { good: "You get a new phone.", bad: "Your old one explodes." },
  { good: "You can fly!", bad: "Only 1 meter above the ground." },
  { good: "Become famous.", bad: "Paparazzi follow you everywhere." },
  { good: "Unlimited games.", bad: "No save files allowed." }
];

const yesMessages = [
  "I would have pressed it too!",
  "Bold choice! I like it.",
  "You made the right call!"
];

const noMessages = [
  "Fair choice, honestly.",
  "I get why you avoided it.",
  "Probably the smart move!"
];

// =========================
// UTILS: FADE
// =========================
function fadeOut(el) {
  return new Promise(resolve => {
    el.style.transition = `opacity ${fadeDuration}ms`;
    el.style.opacity = 0;
    setTimeout(resolve, fadeDuration);
  });
}

function fadeIn(el) {
  return new Promise(resolve => {
    el.style.transition = `opacity ${fadeDuration}ms`;
    el.style.opacity = 1;
    setTimeout(resolve, fadeDuration);
  });
}

// =========================
// GAME VISIBILITY
// =========================
function hideGame() {
  goodText.style.visibility = "hidden";
  badText.style.visibility = "hidden";
  redBtn.style.visibility = "hidden";
  noBtn.style.visibility = "hidden";

  titleText.style.position = "absolute";
  titleText.style.top = "50%";
  titleText.style.left = "50%";
  titleText.style.transform = "translate(-50%, -50%)";
  titleText.style.width = "80%";
  titleText.style.textAlign = "center";
}

function showGame() {
  titleText.style.position = "";
  titleText.style.top = "";
  titleText.style.left = "";
  titleText.style.transform = "";
  titleText.style.width = "";
  titleText.style.textAlign = "";

  goodText.style.visibility = "visible";
  badText.style.visibility = "visible";
  redBtn.style.visibility = "visible";
  noBtn.style.visibility = "visible";
}

// =========================
// RANDOM MESSAGE
// =========================
function randomMessage(pressed) {
  const arr = pressed ? yesMessages : noMessages;
  return arr[Math.floor(Math.random() * arr.length)];
}

// =========================
// ROUND CONTROL
// =========================
function loadRound() {
  const data = rounds[currentRound - 1];
  goodText.textContent = "Good thing: " + data.good;
  badText.textContent = "Bad thing: " + data.bad;
  titleText.textContent = "Would You Press The Button?";
}

// =========================
// NEXT ROUND
// =========================
async function nextRound() {
  currentRound++;

  if (currentRound > totalRounds) {
    await showEndScreen();
    return;
  }

  showGame();
  loadRound();
  await fadeIn(titleText);
}

// =========================
// END SCREEN
// =========================
async function showEndScreen() {
  hideGame();
  await fadeOut(titleText);

  titleText.innerHTML =
    `You pressed the button <b>${pressedCount}</b> times.<br>` +
    `You didn't press the button <b>${notPressedCount}</b> times.<br><br>` +
    `<button id="playAgainBtn">Play Again</button>`;

  await fadeIn(titleText);

  document.getElementById("playAgainBtn").onclick = resetGame;
}

// =========================
// RESET GAME
// =========================
async function resetGame() {
  currentRound = 1;
  pressedCount = 0;
  notPressedCount = 0;

  showGame();
  loadRound();
  await fadeIn(titleText);
}

// =========================
// BUTTON EVENTS
// =========================
redBtn.onclick = async () => {
  pressedCount++;
  hideGame();
  titleText.textContent = randomMessage(true);
  await fadeIn(titleText);
  setTimeout(nextRound, messageDelay);
};

noBtn.onclick = async () => {
  notPressedCount++;
  hideGame();
  titleText.textContent = randomMessage(false);
  await fadeIn(titleText);
  setTimeout(nextRound, messageDelay);
};

// =========================
// INITIALIZE
// =========================
document.body.style.opacity = 1;
loadRound();
