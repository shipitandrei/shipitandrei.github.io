// =========================
// CONFIG
// =========================
const totalRounds = 10;
const messageDelay = 1000; // 1 second
const fadeDuration = 300;

// =========================
// ELEMENTS
// =========================
const titleText = document.getElementById("titleText");
const goodContainer = document.querySelector(".good-container");
const badContainer = document.querySelector(".bad-container");
const goodText = document.getElementById("goodText");
const badText = document.getElementById("badText");
const redBtn = document.getElementById("redBtn");
const noBtn = document.getElementById("noBtn");

// Wrap title in a container for vertical centering
const titleWrapper = document.createElement("div");
titleWrapper.id = "titleWrapper";
document.body.appendChild(titleWrapper);
titleWrapper.style.position = "fixed";
titleWrapper.style.top = 0;
titleWrapper.style.left = 0;
titleWrapper.style.width = "100%";
titleWrapper.style.height = "100%";
titleWrapper.style.display = "flex";
titleWrapper.style.justifyContent = "center";
titleWrapper.style.alignItems = "center";
titleWrapper.style.textAlign = "center";
titleWrapper.style.flexDirection = "column";
titleWrapper.style.opacity = 0;

// =========================
// GAME DATA
// =========================
let currentRound = 1;
let pressedCount = 0;
let notPressedCount = 0;

// =========================
// QUESTIONS (50 placeholders)
// =========================
const questions = [];
for (let i = 1; i <= 50; i++) {
  questions.push({
    good: `${i} good`,
    bad: `${i} bad`,
    yes: `${i} yes`,
    no: `${i} no`
  });
}

// Copy for random selection
let questionPool = shuffleArray([...questions]);

// =========================
// HELPERS
// =========================
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getNextQuestion() {
  if (questionPool.length === 0) questionPool = shuffleArray([...questions]);
  return questionPool.pop();
}

// Fade helpers
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
// ROUND CONTROL
// =========================
let currentQuestion = getNextQuestion();
const gameElements = [titleText, goodContainer, badContainer, redBtn, noBtn];

function loadRound() {
  currentQuestion = getNextQuestion();
  goodText.textContent = currentQuestion.good;
  badText.textContent = "But " + currentQuestion.bad;

  goodContainer.style.display = "flex";
  goodContainer.style.alignItems = "center";
  goodContainer.style.justifyContent = "center";

  badContainer.style.display = "flex";
  badContainer.style.alignItems = "center";
  badContainer.style.justifyContent = "center";

  titleText.textContent = "Would You Press The Button?";
  titleWrapper.style.opacity = 0;
}

// =========================
// BUTTON HANDLER
// =========================
async function handlePress(pressed) {
  if (pressed) pressedCount++;
  else notPressedCount++;

  await fadeOutElements(gameElements);

  // Show custom message centered
  titleWrapper.innerHTML = pressed ? currentQuestion.yes : currentQuestion.no;
  await fadeInElements([titleWrapper]);

  setTimeout(async () => {
    currentRound++;
    if (currentRound > totalRounds) {
      showEndScreen();
    } else {
      await fadeOutElements([titleWrapper]);
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
  titleWrapper.innerHTML =
    `You pressed the button <b>${pressedCount}</b> times.<br>` +
    `You didn't press the button <b>${notPressedCount}</b> times.<br><br>` +
    `<button id="playAgainBtn">Play Again</button>`;
  await fadeInElements([titleWrapper]);

  // Add button listener after it exists
  document.getElementById("playAgainBtn").onclick = resetGame;
}

// =========================
// RESET GAME
// =========================
async function resetGame() {
  currentRound = 1;
  pressedCount = 0;
  notPressedCount = 0;
  questionPool = shuffleArray([...questions]);
  titleWrapper.style.opacity = 0;
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
