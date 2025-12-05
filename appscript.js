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

const gameElements = [titleText, goodContainer, badContainer, redBtn, noBtn];

// =========================
// GAME DATA
// =========================
let currentRound = 1;
let pressedCount = 0;
let notPressedCount = 0;

// =========================
// QUESTIONS (50 editable placeholders)
// =========================
const questions = [
  {good:"1 good", bad:"1 bad", yes:"1 yes", no:"1 no"},
  {good:"2 good", bad:"2 bad", yes:"2 yes", no:"2 no"},
  {good:"3 good", bad:"3 bad", yes:"3 yes", no:"3 no"},
  {good:"4 good", bad:"4 bad", yes:"4 yes", no:"4 no"},
  {good:"5 good", bad:"5 bad", yes:"5 yes", no:"5 no"},
  {good:"6 good", bad:"6 bad", yes:"6 yes", no:"6 no"},
  {good:"7 good", bad:"7 bad", yes:"7 yes", no:"7 no"},
  {good:"8 good", bad:"8 bad", yes:"8 yes", no:"8 no"},
  {good:"9 good", bad:"9 bad", yes:"9 yes", no:"9 no"},
  {good:"10 good", bad:"10 bad", yes:"10 yes", no:"10 no"},
  {good:"11 good", bad:"11 bad", yes:"11 yes", no:"11 no"},
  {good:"12 good", bad:"12 bad", yes:"12 yes", no:"12 no"},
  {good:"13 good", bad:"13 bad", yes:"13 yes", no:"13 no"},
  {good:"14 good", bad:"14 bad", yes:"14 yes", no:"14 no"},
  {good:"15 good", bad:"15 bad", yes:"15 yes", no:"15 no"},
  {good:"16 good", bad:"16 bad", yes:"16 yes", no:"16 no"},
  {good:"17 good", bad:"17 bad", yes:"17 yes", no:"17 no"},
  {good:"18 good", bad:"18 bad", yes:"18 yes", no:"18 no"},
  {good:"19 good", bad:"19 bad", yes:"19 yes", no:"19 no"},
  {good:"20 good", bad:"20 bad", yes:"20 yes", no:"20 no"},
  {good:"21 good", bad:"21 bad", yes:"21 yes", no:"21 no"},
  {good:"22 good", bad:"22 bad", yes:"22 yes", no:"22 no"},
  {good:"23 good", bad:"23 bad", yes:"23 yes", no:"23 no"},
  {good:"24 good", bad:"24 bad", yes:"24 yes", no:"24 no"},
  {good:"25 good", bad:"25 bad", yes:"25 yes", no:"25 no"},
  {good:"26 good", bad:"26 bad", yes:"26 yes", no:"26 no"},
  {good:"27 good", bad:"27 bad", yes:"27 yes", no:"27 no"},
  {good:"28 good", bad:"28 bad", yes:"28 yes", no:"28 no"},
  {good:"29 good", bad:"29 bad", yes:"29 yes", no:"29 no"},
  {good:"30 good", bad:"30 bad", yes:"30 yes", no:"30 no"},
  {good:"31 good", bad:"31 bad", yes:"31 yes", no:"31 no"},
  {good:"32 good", bad:"32 bad", yes:"32 yes", no:"32 no"},
  {good:"33 good", bad:"33 bad", yes:"33 yes", no:"33 no"},
  {good:"34 good", bad:"34 bad", yes:"34 yes", no:"34 no"},
  {good:"35 good", bad:"35 bad", yes:"35 yes", no:"35 no"},
  {good:"36 good", bad:"36 bad", yes:"36 yes", no:"36 no"},
  {good:"37 good", bad:"37 bad", yes:"37 yes", no:"37 no"},
  {good:"38 good", bad:"38 bad", yes:"38 yes", no:"38 no"},
  {good:"39 good", bad:"39 bad", yes:"39 yes", no:"39 no"},
  {good:"40 good", bad:"40 bad", yes:"40 yes", no:"40 no"},
  {good:"41 good", bad:"41 bad", yes:"41 yes", no:"41 no"},
  {good:"42 good", bad:"42 bad", yes:"42 yes", no:"42 no"},
  {good:"43 good", bad:"43 bad", yes:"43 yes", no:"43 no"},
  {good:"44 good", bad:"44 bad", yes:"44 yes", no:"44 no"},
  {good:"45 good", bad:"45 bad", yes:"45 yes", no:"45 no"},
  {good:"46 good", bad:"46 bad", yes:"46 yes", no:"46 no"},
  {good:"47 good", bad:"47 bad", yes:"47 yes", no:"47 no"},
  {good:"48 good", bad:"48 bad", yes:"48 yes", no:"48 no"},
  {good:"49 good", bad:"49 bad", yes:"49 yes", no:"49 no"},
  {good:"50 good", bad:"50 bad", yes:"50 yes", no:"50 no"},
];

// =========================
// RANDOM SELECTION
// =========================
let questionPool = shuffleArray([...questions]);

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

// =========================
// FADE HELPERS
// =========================
function fadeOutElements(elements) {
  return new Promise(resolve => {
    elements.forEach(el => {
      el.style.transition = `opacity ${fadeDuration}ms`;
      el.style.opacity = 0;
      el.style.pointerEvents = "none";
    });
    setTimeout(resolve, fadeDuration);
  });
}

function fadeInElements(elements) {
  return new Promise(resolve => {
    elements.forEach(el => {
      el.style.transition = `opacity ${fadeDuration}ms`;
      el.style.opacity = 1;
      el.style.pointerEvents = "auto";
    });
    setTimeout(resolve, fadeDuration);
  });
}

// =========================
// ROUND CONTROL
// =========================
let currentQuestion = getNextQuestion();

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
  titleText.style.position = "";
  titleText.style.top = "";
  titleText.style.left = "";
  titleText.style.transform = "";
  titleText.style.textAlign = "";
}

// =========================
// BUTTON HANDLER
// =========================
async function handlePress(pressed) {
  if (pressed) pressedCount++;
  else notPressedCount++;

  await fadeOutElements(gameElements);

  titleText.textContent = pressed ? currentQuestion.yes : currentQuestion.no;
  titleText.style.position = "absolute";
  titleText.style.top = "47%";
  titleText.style.left = "50%";
  titleText.style.transform = "translate(-50%, -50%)";
  titleText.style.textAlign = "center";

  await fadeInElements([titleText]);

  setTimeout(async () => {
    currentRound++;
    if (currentRound > totalRounds) {
      showEndScreen();
    } else {
      await fadeOutElements([titleText]);
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

  titleText.innerHTML =
    `You pressed the button <b>${pressedCount}</b> times.<br>` +
    `You didn't press the button <b>${notPressedCount}</b> times.<br><br>` +
    `<button id="playAgainBtn">Play Again</button>`;

  titleText.style.position = "absolute";
  titleText.style.top = "50%";
  titleText.style.left = "50%";
  titleText.style.transform = "translate(-50%, -50%)";
  titleText.style.textAlign = "center";

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
  questionPool = shuffleArray([...questions]);

  titleText.style.position = "";
  titleText.style.top = "";
  titleText.style.left = "";
  titleText.style.transform = "";
  titleText.style.textAlign = "";

  await fadeInElements(gameElements);
  loadRound();
}

// =========================
// INITIALIZE
// =========================
redBtn.onclick = () => handlePress(true);
noBtn.onclick = () => handlePress(false);

// Ensure visible
gameElements.forEach(el => {
  el.style.opacity = 1;
  el.style.pointerEvents = "auto";
});

loadRound();
