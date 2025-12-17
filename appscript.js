// =========================
// CONFIG
// =========================
const totalRounds = 10;
const messageDelay = 1000; // 1 second
const fadeDuration = 300;

// =========================
// STORAGE MANAGER
// =========================
const StorageManager = {
  STORAGE_KEY: 'buttonGameStats',

  getStats() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : {
      totalGamesPlayed: 0,
      totalPresses: 0,
      totalNoPresses: 0,
      lastGameDate: null
    };
  },

  updateStats(pressed, noPresses) {
    const stats = this.getStats();
    stats.totalGamesPlayed++;
    stats.totalPresses += pressed;
    stats.totalNoPresses += noPresses;
    stats.lastGameDate = new Date().toISOString();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats));
    return stats;
  },

  clear() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
};

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
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const gameElements = [titleText, goodContainer, badContainer, redBtn, noBtn];

// =========================
// GAME DATA
// =========================
let currentRound = 1;
let pressedCount = 0;
let notPressedCount = 0;
let isGameActive = true; // whether player input is allowed
let isProcessing = false; // prevent double actions while animating

// =========================
// QUESTIONS (50)
// =========================
// I BROKE SOMETHING OH NO #
const questions = [
  {good:"You get $50,000", bad:"your pants set on fire.", yes:"Can I have some money?", no:"Fireproof pants are expensive."},
  {good:"Someone gives you a huge plot of land and offers to pay 70% of the cost to build your dream house.", bad:"it’s located in the middle of a cemetery.", yes:"Good choice, you can sell it as a haunted house", no:"If you won’t press the button then I will."},
  {good:"Every time you put your hand in your pocket, you can pull out anything you’d like.", bad:"you lose a finger.", yes:"Pull out money and buy new fingers", no:"Hey, I mean robot fingers sounds pretty cool."},
  {good:"You save the world.", bad:"no one will ever know.", yes:"Don’t worry buddy, I’ll remember you.", no:"Remind me not to put you in any positions of power."},
  {good:"You get $1 every time you blink", bad:"every 3 hours you get a sharp pain in your right eye.", yes:"Solution: remove your eye.", no:"I liked that."},
  {good:"You can move objects with your mind", bad:"your TV has a line on it that will never disappear even after replacing it.", yes:"I mean, they say VR headsets are trendy nowadays right?", no:"But telekinesis!"},
  {good:"You replace the protagonist of your favorite piece of fiction", bad:"you forget everything about it", yes:"Spoiler alert: you’re terrible at the plot.", no:"I hate WebKit."},
  {good:"Your reflection talks to you", bad:"it only insults you.", yes:"Finally, someone honest.", no:"Silence is golden I guess."},
  {good:"You can teleport anywhere", bad:"you sometimes end up in someone’s shower.", yes:"Free spa day!", no:"Privacy matters."},
  {good:"You can speak to animals", bad:"they all hate you.", yes:"Nice, now your cat can be extra rude.", no:"Peaceful ignorance, yay."},
  {good:"You gain super strength", bad:"your sneezes demolish walls.", yes:"Bless you, literally.", no:"Better safe than smashing."},
  {good:"You can fly", bad:"your socks catch fire midair.", yes:"Stylish flight!", no:"Feet on the ground forever."},
  {good:"You can read minds", bad:"you hear thoughts of dentists constantly.", yes:"Ouch, so many cavities.", no:"Ignorance is bliss."},
  {good:"You gain a clone to do chores", bad:"it sometimes eats your homework.", yes:"I sure hope you're employed.", no:"Come back when you have a job."},
  {good:"Your shadow can act independently", bad:"it’s mean.", yes:"Finally, a friend who argues back.", no:"Safe and boring."},
  {good:"You get a magic fridge that fills itself", bad:"it sometimes produces live frogs.", yes:"Froggy smoothies!", no:"I like my normal snacks."},
  {good:"You can swap bodies with anyone", bad:"they get your nightmares.", yes:"Nightmare buddy!", no:"Self-respect intact."},
  {good:"You can time travel 5 minutes back", bad:"sometimes you swap heads with a stranger.", yes:"Double the fun!", no:"Head-swaps are scary."},
  {good:"You get invisibility", bad:"everyone forgets you exist", yes:"Finally, freedom!", no:"I like being remembered."},
  {good:"You can control the weather", bad:"it rains spaghetti once a month", yes:"Spaghetti shower!", no:"Gross, no thanks."},
  {good:"You get unlimited pizza", bad:"your hair turns into cheese.", yes:"Fashion and food!", no:"I value clean hair."},
  {good:"You can talk to ghosts", bad:"they give bad advice.", yes:"Spooky life coaching!", no:"Living is simpler."},
  {good:"You gain perfect memory", bad:"you remember everything embarrassing.", yes:"Mortifying clarity!", no:"Ignorance is bliss."},
  {good:"You can make objects float", bad:"they occasionally explode.", yes:"Science or chaos?", no:"I like safe gravity."},
  {good:"You can shrink at will", bad:"sometimes can’t grow back.", yes:"Tiny adventures!", no:"I prefer normal size."},
  {good:"You get a pet dragon", bad:"it breathes fire at random.", yes:"Barbecue master!", no:"Too hot to handle."},
  {good:"You can turn invisible", bad:"your clothes stay visible.", yes:"Fashion ghost!", no:"Clothes are important."},
  {good:"You can instantly learn any language", bad:"you speak in rhymes forever.", yes:"Poetic genius!", no:"I like regular speech."},
  {good:"You gain the power to talk to plants", bad:"they complain constantly.", yes:"Verdant drama!", no:"Silence is golden."},
  {good:"You can summon anything", bad:"it often comes wrong.", yes:"Surprise! It’s a llama.", no:"Predictability is safe."},
  {good:"You can breathe underwater", bad:"everything tastes like tuna.", yes:"Seafood life!", no:"Land is fine."},
  {good:"You can swap your voice with someone", bad:"you sound like a foghorn.", yes:"Annoying but powerful!", no:"Normal voice forever."},
  {good:"You can teleport to memories", bad:"you sometimes live them forever.", yes:"Living nostalgia!", no:"Reality is safer."},
  {good:"You get a bottomless backpack", bad:"it occasionally eats socks.", yes:"Sock thief included!", no:"I like socks."},
  {good:"You become a superhero", bad:"villains know all your secrets.", yes:"Exciting chaos!", no:"Low-profile life is fine."},
  {good:"You can shrink objects", bad:"sometimes your food shrinks too.", yes:"Tiny meal, big fun!", no:"I like my pizza full-sized."},
  {good:"You can control electronics", bad:"your toaster hates you.", yes:"Smart home chaos!", no:"Old school life is safer."},
  {good:"You gain telekinesis", bad:"small objects annoyingly follow you.", yes:"Floating chaos!", no:"Gravity keeps friends away."},
  {good:"You get eternal luck", bad:"someone nearby gets eternal bad luck.", yes:"Jackpot!", no:"I like balanced misery."},
  {good:"You gain super speed", bad:"sometimes run into walls.", yes:"Fast but bruised!", no:"Slow and safe."},
  {good:"You can talk to fish", bad:"they gossip incessantly.", yes:"Fish rumors!", no:"Silence is golden."},
  {good:"You can control dreams", bad:"nightmares happen to you too.", yes:"Dream chaos!", no:"Sleeping peacefully."},
  {good:"You can teleport objects", bad:"sometimes they explode.", yes:"Explosive deliveries!", no:"Stable shipping preferred."},
  {good:"You gain a robot assistant", bad:"it develops an attitude.", yes:"Sassy helper!", no:"I like polite helpers."},
  {good:"You can duplicate food", bad:"it occasionally becomes slime.", yes:"Slime pizza anyone?", no:"Normal meals forever."},
  {good:"You can manipulate luck", bad:"someone unlucky nearby suffers.", yes:"Fortune chaos!", no:"I like fair odds."},
  {good:"You gain a magical hat", bad:"it occasionally talks back.", yes:"Hat’s opinion matters!", no:"Headwear is silent."},
  {good:"You can speak to insects", bad:"they criticize your life choices.", yes:"Buzzing honesty!", no:"Quiet life is better."},
  {good:"You can control fire", bad:"it occasionally sneezes.", yes:"Hot mess!", no:"Cold comfort is safe."},
  {good:"You can swap lives with animals", bad:"sometimes can’t return.", yes:"Fur-tastic adventure!", no:"I like my human life."},
  {good:"You can summon a storm", bad:"it rains pickles.", yes:"Pickle apocalypse!", no:"I prefer dry days."},
  {good:"You gain unlimited candy", bad:"your teeth dissolve slightly.", yes:"Sugar rush!", no:"Dental health first."},
  {good:"You can fly like a bird", bad:"sometimes land in mud.", yes:"Mud splattered flight!", no:"Clean landing every time."},
];

// =========================
// RANDOM SELECTION
// =========================
let questionPool = shuffleArray([...questions]);
// Track questions shown in the current game to avoid repeats
let currentGameSeen = new Set();

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getNextQuestion() {
  // Pop until we find a question not shown in this game yet
  while (questionPool.length > 0) {
    const q = questionPool.pop();
    const key = (q.good || '') + '|' + (q.bad || '');
    if (!currentGameSeen.has(key)) {
      currentGameSeen.add(key);
      return q;
    }
    // otherwise skip duplicates for this game and continue
  }

  // If we ran out of unseen questions (unlikely with large question pool),
  // rebuild pool with questions that haven't been seen yet. If none remain,
  // allow repeats by refilling the pool with all questions.
  const remaining = questions.filter(q => {
    const key = (q.good || '') + '|' + (q.bad || '');
    return !currentGameSeen.has(key);
  });
  if (remaining.length > 0) {
    questionPool = shuffleArray(remaining);
  } else {
    questionPool = shuffleArray([...questions]);
    // clear seen to allow repeats only when we've exhausted all unique questions
    currentGameSeen.clear();
  }

  // After refill, pop the next question (if any)
  if (questionPool.length === 0) return null;
  const q2 = questionPool.pop();
  currentGameSeen.add((q2.good || '') + '|' + (q2.bad || ''));
  return q2;
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

  // Update progress indicator
  const progressPercent = (currentRound / totalRounds) * 100;
  progressFill.style.width = progressPercent + '%';
  progressText.textContent = `Round ${currentRound}/${totalRounds}`;

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
  if (!isGameActive || isProcessing) return;
  isProcessing = true;
  // Ensure visual feedback even if the input source didn't trigger pointerdown
  simulateButtonPress(pressed ? redBtn : noBtn);
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
      await showEndScreen();
      isProcessing = false;
    } else {
      await fadeOutElements([titleText]);
      await fadeInElements(gameElements);
      loadRound();
      isProcessing = false;
    }
  }, messageDelay);
}

// =========================
// END SCREEN
// =========================
async function showEndScreen() {
  // Mark game as inactive to ignore keyboard input
  isGameActive = false;
  await fadeOutElements([goodContainer, badContainer, redBtn, noBtn]);
  // Show a quick loading state for immediate feedback, then calculate stats
  titleText.innerHTML =
    `<div style="font-size: 0.95em; line-height: 1.6;">
      <div>Calculating results<span class="spinner" aria-hidden="true"></span></div>
    </div>`;

  titleText.style.position = "absolute";
  titleText.style.top = "46.1%";
  titleText.style.left = "50%";
  titleText.style.transform = "translate(-50%, -50%)";
  titleText.style.textAlign = "center";

  await fadeInElements([titleText]);

  // Defer the potentially expensive stats update to allow the UI to paint
  setTimeout(() => {
    const allTimeStats = StorageManager.updateStats(pressedCount, notPressedCount);

    titleText.innerHTML =
      `<div style="font-size: 0.9em; line-height: 1.6;">
        <b>This Game:</b><br>
        You pressed the button <b>${pressedCount}</b> times.<br>
        You didn't press the button <b>${notPressedCount}</b> times.<br><br>
        <b>All-Time Stats:</b><br>
        Games Played: <b>${allTimeStats.totalGamesPlayed}</b><br>
        Total Presses: <b>${allTimeStats.totalPresses}</b><br>
        Total Declines: <b>${allTimeStats.totalNoPresses}</b><br>
        <br>
        <button id="playAgainBtn">Play Again</button>
      </div>`;

    document.getElementById("playAgainBtn").onclick = resetGame;
  }, 10);
}

// =========================
// RESET GAME
// =========================
async function resetGame() {
  // Fade out end screen
  await fadeOutElements([titleText]);

  currentRound = 1;
  pressedCount = 0;
  notPressedCount = 0;
  questionPool = shuffleArray([...questions]);
  currentGameSeen.clear();

  titleText.style.position = "";
  titleText.style.top = "";
  titleText.style.left = "";
  titleText.style.transform = "";
  titleText.style.textAlign = "";

  // Reset progress indicator
  progressFill.style.width = '10%';
  progressText.textContent = 'Round 1/10';

  loadRound();
  await fadeInElements(gameElements);
  // Re-enable keyboard input
  isGameActive = true;
}

// =========================
// INITIALIZE
// =========================
// Pointer events for visual feedback and click handlers
if (redBtn) {
  redBtn.addEventListener('pointerdown', () => triggerFeedback(redBtn));
  redBtn.addEventListener('click', () => handlePress(true));
}

if (noBtn) {
  noBtn.addEventListener('pointerdown', () => triggerFeedback(noBtn));
  noBtn.addEventListener('click', () => handlePress(false));
}

// Ensure visible
gameElements.forEach(el => {
  el.style.opacity = 1;
  el.style.pointerEvents = "auto";
});

loadRound();

// =========================
// KEYBOARD SUPPORT (y/n)
// =========================
function simulateButtonPress(buttonEl) {
  if (!buttonEl) return;
  // Use Web Animations API when available for reliable short press animation
  if (typeof buttonEl.animate === 'function') {
    // Cancel any running press animation
    if (buttonEl._pressAnim) {
      try { buttonEl._pressAnim.cancel(); } catch (e) {}
    }
    const anim = buttonEl.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(0.94)' },
      { transform: 'scale(1)' }
    ], { duration: 180, easing: 'ease-out' });
    buttonEl._pressAnim = anim;
    anim.onfinish = () => { buttonEl._pressAnim = null; };
  } else {
    // Fallback to class toggle
    buttonEl.classList.add('press-anim');
    setTimeout(() => buttonEl.classList.remove('press-anim'), 150);
  }
}



// Vibration/haptic helper (no-op if unsupported)
function vibrateIfAvailable(pattern = 20) {
  try {
    if (navigator && typeof navigator.vibrate === 'function') {
      navigator.vibrate(pattern);
    }
  } catch (e) {
    // ignore
  }
}

// Trigger both visual and haptic feedback
function triggerFeedback(buttonEl) {
  simulateButtonPress(buttonEl);
  vibrateIfAvailable(20);
}

function handleKeyDown(e) {
  // ignore if typing in an input/textarea
  const tag = document.activeElement && document.activeElement.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;

  const key = (e.key || '').toLowerCase();

  // If end screen is visible, allow Enter/Space to restart the game
  if (!isGameActive) {
    if (key === 'enter' || key === ' ' || key === 'spacebar' || e.code === 'Space') {
      const playBtn = document.getElementById('playAgainBtn');
      if (playBtn) {
        // provide visual feedback on the button before clicking
        simulateButtonPress(playBtn);
        setTimeout(() => playBtn.click(), 80);
      }
    }
    return;
  }

  if (isProcessing) return;

  if (key === 'y') {
    triggerFeedback(redBtn);
    handlePress(true);
  } else if (key === 'n') {
    triggerFeedback(noBtn);
    handlePress(false);
  }
}

window.addEventListener('keydown', handleKeyDown);

// Hide the keyboard hint on mobile devices (or touch devices with small screens)
(function hideKeyboardHintOnMobile() {
  const hint = document.getElementById('keyboardHint');
  if (!hint) return;

  const uaMobile = /iphone|ipad|ipod|android/i.test(navigator.userAgent);
  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
  const smallScreen = window.innerWidth <= 800;

  if (uaMobile || (isTouch && smallScreen)) {
    hint.style.display = 'none';
  }
})();
