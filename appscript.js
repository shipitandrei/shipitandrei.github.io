// =========================
// CONFIG
// =========================
const roundDelay = 1000; // time message stays visible
const fadeSpeed = 300;   // milliseconds per fade

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

// =========================
// UTIL: Fade
// =========================
function fadeOut(element) {
  return new Promise(resolve => {
    element.style.transition = `opacity ${fadeSpeed}ms`;
    element.style.opacity = 0;
    setTimeout(resolve, fadeSpeed);
  });
}

function fadeIn(element) {
  return new Promise(resolve => {
    element.style.transition = `opacity ${fadeSpeed}ms`;
    element.style.opacity = 1;
    setTimeout(resolve, fadeSpeed);
  });
}

// =========================
// HIDE & SHOW GAME
// =========================
function hideGame() {
  // Center title
  document.body.style.display = "flex";
  document.body.style.flexDirection = "column";
  document.body.style.justifyContent = "center";
  document.body.style.alignItems = "center";

  titleText.style.position = "fixed";
  titleText.style.top = "50%";
  titleText.style.left = "50%";
  titleText.style.transform = "translate(-50%, -50%)";
  titleText.style.textAlign = "center";

  goodText.style.display = "none";
  badText.style.display = "none";
  redBtn.style.display = "none";
  noBtn.style.display = "none";
}

function showGame() {
  document.body.style.display = "";
  document.body.style.flexDirection = "";
  document.body.style.justifyContent = "";
  document.body.style.alignItems = "";

  titleText.style.position = "";
  titleText.style.top = "";
  titleText.style.left = "";
  titleText.style.transform = "";
  titleText.style.textAlign = "";

  goodText.style.display = "block";
  badText.style.display = "block";
  redBtn.style.display = "block";
  noBtn.style.display = "block";
}

// =========================
// RANDOM MESSAGE
// =========================
function randomMessage(pressed) {
  const yes = [
    "I would have pressed it too!",
    "Bold choice! I like it.",
    "You made the right call!"
  ];
  const no = [
    "Fair choice, honestly.",
    "I get why you avoided it.",
    "Probably the smart move!"
  ];
  return pressed
    ? yes[Math.floor(Math.random() * yes.length)]
    : no[Math.floor(Math.random() * no.length)];
}

// =========================
// ROUND CONTROL
// =========================
function loadRound() {
  const data = rounds[currentRound - 1];
  goodText.textContent = data.good;
  badText.textContent = "But" + data.bad;
  titleText.textContent = "Would You Press The Button?";
}

async function nextRound() {
  currentRound++;

  if (currentRound > 10) {
    showEndScreen();
    return;
  }

  showGame();
  await fadeIn(document.body);
  loadRound();
}

// =========================
// END SCREEN
// =========================
async function showEndScreen() {
  hideGame();
  await fadeOut(document.body);

  titleText.innerHTML =
    `You pressed the button <b>${pressedCount}</b> times.<br>` +
    `You didn't press the button <b>${notPressedCount}</b> times.<br><br>` +
    `<button id="playAgainBtn">Play Again</button>`;

  await fadeIn(document.body);

  document.getElementById("playAgainBtn").onclick = resetGame;
}

async function resetGame() {
  currentRound = 1;
  pressedCount = 0;
  notPressedCount = 0;

  await fadeOut(document.body);
  showGame();
  loadRound();
  await fadeIn(document.body);
}

// =========================
// BUTTON EVENTS
// =========================
redBtn.onclick = async () => {
  pressedCount++;
  await fadeOut(document.body);
  hideGame();
  titleText.textContent = randomMessage(true);
  await fadeIn(document.body);
  setTimeout(nextRound, roundDelay);
};

noBtn.onclick = async () => {
  notPressedCount++;
  await fadeOut(document.body);
  hideGame();
  titleText.textContent = randomMessage(false);
  await fadeIn(document.body);
  setTimeout(nextRound, roundDelay);
};

// Start the first round
loadRound();
document.body.style.opacity = 1;
