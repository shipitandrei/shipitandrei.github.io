// Arrays of good/bad things
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

// Response messages for each button
const redButtonResponses = [
  "I would have picked that too!",
  "Bold choice! Well done!",
  "You took the risk and I respect that!"
];

const noButtonResponses = [
  "If I were you, I really would have pressed that button.",
  "Playing it safe is wise!",
  "You avoided disaster... maybe!"
];

// Grab elements
const redButton = document.querySelector('.red-button');
const noButton = document.querySelector('.no-button');
const heading = document.querySelector('.top-section h1');
const goodText = document.querySelector('.good-thing');
const badText = document.querySelector('.bad-thing');

// Function to pick random item from array
function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Function to hide all game elements
function hideGameElements() {
  heading.style.display = 'none';
  goodText.style.display = 'none';
  badText.style.display = 'none';
  redButton.style.display = 'none';
  noButton.style.display = 'none';
}

// Function to show response message
function showResponse(message) {
  const responseDiv = document.createElement('div');
  responseDiv.textContent = message;
  responseDiv.style.position = 'absolute';
  responseDiv.style.top = '50%';
  responseDiv.style.left = '50%';
  responseDiv.style.transform = 'translate(-50%, -50%)';
  responseDiv.style.fontSize = '24px';
  responseDiv.style.color = '#fff';
  responseDiv.style.textAlign = 'center';
  responseDiv.style.padding = '20px';
  responseDiv.style.pointerEvents = 'none';
  document.body.appendChild(responseDiv);
}

// Red button click
redButton.addEventListener('click', () => {
  goodText.textContent = "Good thing: " + getRandom(goodThings);
  badText.textContent = "Bad thing: " + getRandom(badThings);
  const responseMessage = getRandom(redButtonResponses);
  hideGameElements();
  showResponse(responseMessage);
});

// "I don't press" button click
noButton.addEventListener('click', () => {
  const responseMessage = getRandom(noButtonResponses);
  hideGameElements();
  showResponse(responseMessage);
});
