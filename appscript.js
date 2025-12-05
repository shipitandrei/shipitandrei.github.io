const roundsTotal = 10;
let currentRound = 0;
let pressedCount = 0;
let notPressedCount = 0;

const goodThings = [
  "You get $1,000 instantly!",
  "You can fly for 10 seconds every day!",
  "You get unlimited pizza!",
  "You never have homework again!",
  "You become TikTok famous!",
  "You wake up with perfect hair!",
  "You ace every exam without studying!",
  "You get a free puppy!",
  "You can speak every language!",
  "You get a new gaming PC!"
];

const badThings = [
  "But you must shout in public.",
  "But you smell like onions for 1 hour.",
  "But you lose your phone for a day.",
  "But you have to eat a spoonful of mustard.",
  "But you can only talk in whispers.",
  "But you must wear socks on your hands.",
  "But you get jumpscared once.",
  "But you must run 1 lap around your house.",
  "But you hiccup for 5 minutes.",
  "But you sneeze 20 times."
];

const titleText = document.getElementById("titleText");
const goodText = document.getElementById("goodText");
const badText = document.getElementById("badText");
const redBtn = document.getElementById("redBtn");
const noBtn = document.getElementById("noBtn");

function hideGame() {
  goodText.style.display = "none";
  badText.style.display = "none";
  redBtn.style.display = "none";
  noBtn.style.display = "none";
}

function showGame() {
  goodText.style.display = "block";
  badText.style.display = "block";
  redBtn.style.display = "block";
  noBtn.style.display = "block";
}

function randomMessage(pressed) {
  const pressedMsgs = [
    "I would have pressed it too!",
    "Brave choice!",
    "Nice one!",
    "Solid decision!",
    "Fair enough!"
  ];

  const notPressedMsgs = [
    "Honestly, same.",
    "Probably the safe choice!",
    "I get why you didn’t.",
    "Reasonable decision!",
    "Maybe next time!"
  ];

  return pressed
    ? pressedMsgs[Math.floor(Math.random() * pressedMsgs.length)]
    : notPressedMsgs[Math.floor(Math.random() * notPressedMsgs.length)];
}

function nextRound() {
  if (currentRound >= roundsTotal) {
    showEndScreen();
    return;
  }

  currentRound++;

  const i = Math.floor(Math.random() * goodThings.length);
  goodText.textContent = "Good thing: " + goodThings[i];
  badText.textContent = "Bad thing: " + badThings[i];

  showGame();
  titleText.textContent = "Would You Press The Button?";
}

function showEndScreen() {
  hideGame();

  titleText.innerHTML =
    `You pressed the button <b>${pressedCount}</b> times.<br>` +
    `You didn't press the button <b>${notPressedCount}</b> times.<br><br>`;

  const playAgainBtn = document.createElement("button");
  playAgainBtn.textContent = "Play Again";
  playAgainBtn.style.fontSize = "22px";
  playAgainBtn.style.padding = "12px 20px";
  playAgainBtn.style.marginTop = "20px";
  playAgainBtn.style.cursor = "pointer";

  playAgainBtn.onclick = resetGame;

  titleText.appendChild(playAgainBtn);
}

function resetGame() {
  currentRound = 0;
  pressedCount = 0;
  notPressedCount = 0;

  nextRound();
}

redBtn.onclick = () => {
  pressedCount++;
  hideGame();
  titleText.textContent = randomMessage(true);

  setTimeout(nextRound, 1000);
};

noBtn.onclick = () => {
  notPressedCount++;
  hideGame();
  titleText.textContent = randomMessage(false);

  setTimeout(nextRound, 1000);
};

nextRound();
