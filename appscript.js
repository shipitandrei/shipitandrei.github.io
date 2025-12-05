// =========================
// CONFIG
// =========================
const totalRounds = 10;
const messageDelay = 1000; // 1 second
const fadeDuration = 300;  // fade speed in ms

// =========================
// ELEMENTS
// =========================
const titleText = document.getElementById("titleText");
const goodText = document.getElementById("goodText");
const badText = document.getElementById("badText");
const redBtn = document.getElementById("redBtn");
const noBtn = document.getElementById("noBtn");

// =========================
// GAME DATA
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

const yesResponses = [
  "I would have pressed that too!",
  "Bold choice! I like it.",
  "You made the right call!"
];

const noResponses = [
  "Fair choice, honestly.",
  "I get why you avoided it.",
  "Probably the smart move!"
];

// =========================
// FADE FUNCTIONS
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
// SHOW/HIDE GAME
// =========================
function hideGame() {
  goodText.style.visibility = "hidden";
  badText.style.visibility = "hidden";
  redBtn.style.visibility = "hidden";
  noBtn.style.visibility = "hidden";
}

function showGame() {
  goodText.style.visibility = "visible";
  badText.style.visibility = "visible";
  redBtn.style.visibility = "visible";
  noBtn.style.visibility = "visible";
  titleText.textContent = "Would You Press The Button?";
}

// =========================
// ROUND CONTROL
// =========================
function loadRound() {
  const data = rounds[currentRound - 1];
  goodText.textContent = "Good thing: " + data.good;
  badText.textContent = "Bad thing: " + data.bad;
}

// =========================
// BUTTON RESPONSES
// =========================
async function handlePress(pressed) {
  // Count
  if (pressed) pressedCount++;
  else notPressedCount++;

  // Hide game
  await fadeOut(goodText);
  await fadeOut(badText);
  await fadeOut(redBtn);
  await fadeOut(noBtn);

  hideGame();

  // Show custom response centered
  const message = pressed
    ? yesResponses[Math.floor(Math.random() * yesResponses.length)]
    : noResponses[Math.floor(Math.random() * noResponses.length)];

  titleText.style.position = "absolute";
  titleText.style.top = "50%";
  titleText.style.left = "50%";
  titleText.style.transform = "translate(-50%, -50%)";
  titleText.style.textAlign = "center";
  titleText.textContent = message;

  await fadeIn(titleText);

  // Next round after delay
  setTimeout(async () => {
    currentRound++;
    if (currentRound > totalRounds) {
      showEndScreen();
    } else {
      // Reset title
      titleText.style.position = "";
      titleText.style.top = "";
      titleText.style.left = "";
      titleText.style.transform = "";
      titleText.style.textAlign = "";

      showGame();
      loadRound();
      await fadeIn(goodText);
      await fadeIn(badText);
      await fadeIn(redBtn);
      await fadeIn(noBtn);
    }
  }, messageDelay);
}

// =========================
// END SCREEN
// =========================
async function showEndScreen() {
  hideGame();
  await fadeOut(titleText);

  titleText.style.position = "absolute";
  titleText.style.top = "50%";
  titleText.style.left = "50%";
  titleText.style.transform = "translate(-50%, -50%)";
  titleText.style.textAlign = "center";

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

  titleText.style.position = "";
  titleText.style.top = "";
  titleText.style.left = "";
  titleText.style.transform = "";
  titleText.style.textAlign = "center";

  showGame();
  loadRound();
  await fadeIn(goodText);
  await fadeIn(badText);
  await fadeIn(redBtn);
  await fadeIn(noBtn);
}

// =========================
// INITIALIZE
// =========================
redBtn.onclick = () => handlePress(true);
noBtn.onclick = () => handlePress(false);

// Initialize first round
loadRound();
document.body.style.opacity = 1;
