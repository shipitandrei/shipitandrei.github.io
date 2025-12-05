// =========================
// CONFIG
// =========================
const totalRounds = 10;       // Total rounds per game
const messageDelay = 1000;    // Delay in ms
const fadeDuration = 300;     // Fade duration in ms

// =========================
// ELEMENTS
// =========================
const titleText = document.getElementById("titleText");
const goodText = document.getElementById("goodText");
const badText = document.getElementById("badText");
const redBtn = document.getElementById("redBtn");
const noBtn = document.getElementById("noBtn");

const gameElements = [titleText, goodText, badText, redBtn, noBtn];

// =========================
// GAME DATA
// =========================
let currentRound = 1;
let pressedCount = 0;
let notPressedCount = 0;

// Question pool
const questions = [
  {
    good: "You get $1,000 instantly!",
    bad: "You must shout in public.",
    yes: "Can I have a bit of that money?",
    no: "Come on, shouting in public isn’t even that bad."
  },
  {
    good: "Free pizza for life!",
    bad: "You can never eat burgers again.",
    yes: "Mmm pizza! I would press it too.",
    no: "Skipping pizza for burgers? Interesting choice."
  },
  {
    good: "Unlimited WiFi anywhere.",
    bad: "Battery always stuck at 10%.",
    yes: "Unlimited WiFi? Count me in!",
    no: "10% battery all the time? Smart move."
  },
  // ... add all 50+ questions here
];

// Shuffle pool helper
let questionPool = [];

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Get next random question
function getNextQuestion() {
  if (questionPool.length === 0) {
    // Refill pool if empty
    questionPool = shuffleArray([...questions]);
  }
  return questionPool.pop();
}

let currentQuestion = getNextQuestion();

// =========================
// FADE FUNCTIONS
// =========================
function fadeOutElements(elements) {
  return new Promise(resolve => {
    elements.forEach(el => el.style.transition = `opacity ${fadeDuration}ms`);
    elements.forEach(el => el.style.opacity = 0);
    setTimeout(resolve, fadeDuration);
  });
}

function fadeInElements(elements) {
  return new Promise(resolve => {
    elements.forEach(el => el.style.transition = `opacity ${fadeDuration}ms`);
    elements.forEach(el => el.style.opacity = 1);
    setTimeout(resolve, fadeDuration);
  });
}

// =========================
// POSITION HELPERS
// =========================
function centerMessage() {
  titleText.style.position = "fixed";
  titleText.style.top = "50%";
  titleText.style.left = "50%";
  titleText.style.transform = "translate(-50%, -50%)";
  titleText.style.textAlign = "center";
  titleText.style.width = "80%";
}

function resetTitlePosition() {
  titleText.style.position = "";
  titleText.style.top = "";
  titleText.style.left = "";
  titleText.style.transform = "";
  titleText.style.textAlign = "";
  titleText.style.width = "";
}

// =========================
// ROUND CONTROL
// =========================
function loadRound() {
  currentQuestion = getNextQuestion();
  goodText.textContent = "Good thing: " + currentQuestion.good;
  badText.textContent = "Bad thing: " + currentQuestion.bad;
  titleText.textContent = "Would You Press The Button?";
}

// =========================
// BUTTON HANDLER
// =========================
async function handlePress(pressed) {
  if (pressed) pressedCount++;
  else notPressedCount++;

  await fadeOutElements(gameElements);

  // Show custom message
  centerMessage();
  titleText.textContent = pressed ? currentQuestion.yes : currentQuestion.no;
  await fadeInElements([titleText]);

  setTimeout(async () => {
    currentRound++;
    if (currentRound > totalRounds) {
      showEndScreen();
    } else {
      resetTitlePosition();
      await fadeInElements(gameElements);
      loadRound();
    }
  }, messageDelay);
}

// =========================
// END SCREEN
// =========================
async function showEndScreen() {
  await fadeOutElements(gameElements);
  centerMessage();
  titleText.innerHTML =
    `You pressed the button <b>${pressedCount}</b> times.<br>` +
    `You didn't press the button <b>${notPressedCount}</b> times.<br><br>` +
    `<button id="playAgainBtn">Play Again</button>`;
  await fadeInElements([titleText]);

  document.getElementById("playAgainBtn").onclick = resetGame;
}

// =========================
// RESET GAME
// =========================
async function resetGame() {
  currentRound = 1;
  pressedCount = 0;
  notPressedCount = 0;
  resetTitlePosition();
  await fadeInElements(gameElements);
  loadRound();
}

// =========================
// INITIALIZE
// =========================
redBtn.onclick = () => handlePress(true);
noBtn.onclick = () => handlePress(false);
gameElements.forEach(el => el.style.opacity = 1);
loadRound();
