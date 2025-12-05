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
// QUESTIONS (50)
// =========================
const questions = [
  {good:"You get ₱2,500,000", bad:"your pants catch fire.", yes:"I trust you can handle that money safely!", no:"Maybe avoid pressing while pants are on fire?"},
  {good:"You become fluent in every language", bad:"you forget your native tongue.", yes:"Polyglot power achieved!", no:"Better to keep your mother tongue intact."},
  {good:"You wake up perfectly rested every day", bad:"you cannot sleep one week per year.", yes:"Who needs sleep anyway?", no:"I like my dreams too much."},
  {good:"You have a photographic memory", bad:"you forget one childhood memory.", yes:"Now you’ll never forget a thing!", no:"Some memories are worth keeping."},
  {good:"You instantly master any musical instrument", bad:"you cannot listen to music for a month.", yes:"Rock on, maestro!", no:"Music is life, I can’t give it up."},
  {good:"You can fly", bad:"you age twice as fast while flying.", yes:"Soaring to new heights!", no:"No way, I’d rather stay young."},
  {good:"You can read minds at will", bad:"you can’t turn it off.", yes:"Now I know what everyone really thinks!", no:"Some thoughts are better left unknown."},
  {good:"One wish granted", bad:"you lose a close friend.", yes:"Wish wisely!", no:"Friendship is priceless."},
  {good:"Lose 20 kg instantly", bad:"feel constant fatigue.", yes:"Slim and energetic, let’s do it!", no:"I need my energy more than a diet."},
  {good:"Become famous and wealthy", bad:"your private life is exposed.", yes:"Time to shine!", no:"Privacy over fame any day."},
  {good:"Teleport anywhere instantly", bad:"forget where you started.", yes:"Adventure awaits!", no:"Getting lost is scary, better not."},
  {good:"Gain super strength", bad:"accidentally harm someone you love.", yes:"Power at my fingertips!", no:"No way, I can’t risk loved ones."},
  {good:"Live forever", bad:"everyone around you dies.", yes:"Immortality achieved!", no:"Life is better shared."},
  {good:"Meet your future self", bad:"can’t change anything.", yes:"Hello future me!", no:"Some mysteries are better left alone."},
  {good:"Talk to animals", bad:"hear their pain too.", yes:"I can finally chat with my cat!", no:"No thanks, that’s a lot of suffering."},
  {good:"Endless supply of favorite snacks", bad:"can never eat anything else.", yes:"Snack heaven!", no:"Variety is the spice of life."},
  {good:"Relive one memory exactly", bad:"forget a random memory.", yes:"Time to enjoy nostalgia!", no:"No, I treasure all my memories."},
  {good:"Become incredibly lucky", bad:"bring bad luck to someone you care about monthly.", yes:"Luck is on my side!", no:"Not worth ruining loved ones' luck."},
  {good:"Master every skill instantly", bad:"lose your sense of humor.", yes:"Genius achieved!", no:"I need laughter in my life."},
  {good:"Breathe underwater", bad:"cannot walk on land again.", yes:"Underwater exploration!", no:"Land is too important."},
  {good:"Rewind time 5 minutes per day", bad:"forget what you changed.", yes:"Second chances!", no:"No, too confusing."},
  {good:"Never get sick again", bad:"feel no pain (even serious injury).", yes:"Invincible!", no:"Pain is useful, better not."},
  {good:"Live to 100 in perfect health", bad:"siblings live half as long.", yes:"Longevity secured!", no:"Family matters more than lifespan."},
  {good:"See 10 minutes into the future", bad:"lose all surprise.", yes:"Predictable power!", no:"Life needs surprises."},
  {good:"Teleport once per day", bad:"age 1 year each time.", yes:"Fast travel!", no:"Aging too fast, no thanks."},
  {good:"Perfect aim and reflexes", bad:"can never lie.", yes:"Sharpshooter!", no:"Sometimes lies are necessary."},
  {good:"Control weather locally", bad:"sacrifice 10 happy memories.", yes:"Sun or rain, I choose!", no:"Memories are worth more."},
  {good:"Talk to plants", bad:"age faster.", yes:"Green thumb achieved!", no:"I’ll stay young, thank you."},
  {good:"Unlimited energy", bad:"lose ability to dream.", yes:"Endless productivity!", no:"Dreams fuel creativity."},
  {good:"Become genius artist overnight", bad:"experience loneliness.", yes:"Masterpiece mode!", no:"Loneliness isn’t worth talent."},
  {good:"Clone yourself to do chores", bad:"clone might pick your enemies.", yes:"Chores solved!", no:"Too risky, clone rebellion."},
  {good:"See everyone’s true intentions", bad:"cannot make new friends.", yes:"Truth revealed!", no:"Friendship is worth some mystery."},
  {good:"Night vision forever", bad:"go blind in daylight.", yes:"Darkness is my ally!", no:"Daylight matters more."},
  {good:"Voice can persuade anyone once/week", bad:"lose voice rest of the week.", yes:"Power of persuasion!", no:"Talking is essential."},
  {good:"Heal instantly from any injury", bad:"intense pain each healing.", yes:"Survive anything!", no:"Pain is too much."},
  {good:"Perfect taste in food", bad:"others lose flavor sharing food.", yes:"Delicious!", no:"I can’t take that away from others."},
  {good:"Become invisible at will", bad:"forget your own face.", yes:"Stealth mode!", no:"Identity is too important."},
  {good:"Free luxury house anywhere", bad:"can never leave.", yes:"Home sweet home!", no:"Freedom over luxury."},
  {good:"Speak to dead people", bad:"see them always, even sleeping.", yes:"Conversations never end!", no:"Rest is important."},
  {good:"Master any sport instantly", bad:"cannot enjoy it again.", yes:"Champion!", no:"Fun is why I play."},
  {good:"Unlimited money for 1 year", bad:"owe double after 10 years.", yes:"Spend wisely!", no:"Debt is too scary."},
  {good:"Shapeshift into any animal", bad:"forget you’re human sometimes.", yes:"Adventure awaits!", no:"Human mind is essential."},
  {good:"Perfect recall of every dream", bad:"can never dream again.", yes:"Clarity!", no:"Dreams fuel imagination."},
  {good:"Legendary status among peers", bad:"sacrifice childhood memories.", yes:"Fame achieved!", no:"Childhood is priceless."},
  {good:"You can pause time anytime", bad:"time skips 1 hour randomly.", yes:"Time is mine!", no:"Too unpredictable, no."},
  {good:"You gain a robot assistant", bad:"it sometimes malfunctions dangerously.", yes:"Help at last!", no:"I like being safe."},
  {good:"You can swap lives with anyone once", bad:"they control you for a day.", yes:"New perspective!", no:"I value autonomy."},
  {good:"You can summon anything", bad:"randomly loses one possession permanently.", yes:"Power to summon!", no:"Loss too risky."},
  {good:"You can teleport back to any memory", bad:"forget a current memory.", yes:"Relive moments!", no:"Current life matters more."},
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
  titleText.style.top = "46.1%";
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
  titleText.style.top = "46.1%";
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
