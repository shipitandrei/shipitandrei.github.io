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
// I BROKE SOMETHING OH NO 
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

  // If we ran out of unseen questions,
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
// CONFETTI
// =========================
let _confetti = {
  canvas: null,
  ctx: null,
  particles: [],
  animId: null
};

function _ensureConfettiCanvas() {
  if (_confetti.canvas && _confetti.ctx) return true;
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return false;
  _confetti.canvas = canvas;
  _confetti.ctx = canvas.getContext('2d');
  _resizeConfetti();
  return true;
}

function _resizeConfetti() {
  if (!_confetti.canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  _confetti.canvas.width = Math.floor(w * dpr);
  _confetti.canvas.height = Math.floor(h * dpr);
  _confetti.canvas.style.width = w + 'px';
  _confetti.canvas.style.height = h + 'px';
  if (_confetti.ctx) _confetti.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function _createParticle(x, y) {
  const colors = ['#ff4757', '#ff6b81', '#ffa502', '#2ed573', '#1e90ff', '#9b59b6'];
  const size = 6 + Math.random() * 8;
  return {
    x: x + (Math.random() - 0.5) * 80,
    y: y + (Math.random() - 0.5) * 20,
    vx: (Math.random() - 0.5) * 6,
    vy: Math.random() * -6 - 2,
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.2,
    size: size,
    color: colors[Math.floor(Math.random() * colors.length)],
    opacity: 1,
    // increase TTL so particles persist longer (frames)
    ttl: 100 + Math.random() * 80
  };
}

function _confettiLoop() {
  const c = _confetti.ctx;
  const canvas = _confetti.canvas;
  if (!c || !canvas) return stopConfetti();
  c.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = _confetti.particles.length - 1; i >= 0; i--) {
    const p = _confetti.particles[i];
    p.vy += 0.15; // gravity
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.ttl -= 1;
    p.opacity = Math.max(0, p.ttl / 100);

    c.save();
    c.globalAlpha = p.opacity;
    c.translate(p.x, p.y);
    c.rotate(p.rot);
    c.fillStyle = p.color;
    c.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    c.restore();

    if (p.y > (canvas.height / (window.devicePixelRatio || 1)) + 50 || p.ttl <= 0) {
      _confetti.particles.splice(i, 1);
    }
  }

  if (_confetti.particles.length > 0) {
    _confetti.animId = requestAnimationFrame(_confettiLoop);
  } else {
    _confetti.animId = null;
    if (c) c.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function launchConfetti({ particleCount = 80, originX = window.innerWidth / 2, originY = window.innerHeight / 3, duration = 5000 } = {}) {
  if (!_ensureConfettiCanvas()) return;
  _resizeConfetti();
  for (let i = 0; i < particleCount; i++) {
    _confetti.particles.push(_createParticle(originX, originY));
  }
  if (!_confetti.animId) _confetti.animId = requestAnimationFrame(_confettiLoop);

  // stop adding after duration; particles will naturally die
  setTimeout(() => {
    // ensure we stop after a short buffer
    setTimeout(stopConfetti, 2000);
  }, duration);
}

function stopConfetti() {
  if (_confetti.animId) {
    cancelAnimationFrame(_confetti.animId);
    _confetti.animId = null;
  }
  _confetti.particles = [];
  if (_confetti.ctx && _confetti.canvas) _confetti.ctx.clearRect(0, 0, _confetti.canvas.width, _confetti.canvas.height);
}

window.addEventListener('resize', () => { try { _resizeConfetti(); } catch (e) {} });

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
  // Show a quick loading state to keep user happy, then calculate stats
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

  // Launch confetti for celebration (non-blocking) using user-set intensity
  try {
    const storedLevel = parseInt(localStorage.getItem('celebrationLevel') || '60', 10);
    const level = (isNaN(storedLevel) ? 60 : storedLevel);
    // Map level (0-100) to particle count and duration
    const particleCount = Math.max(10, Math.round(30 + (level / 100) * 170)); // 30-200
    const duration = Math.max(800, Math.round(1000 + (level / 100) * 9000)); // ~1s-10s
    launchConfetti({ particleCount, duration });
  } catch (e) {}

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

  // ensure confetti stops when returning to game
  try { stopConfetti(); } catch (e) {}

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

// Initialize Settings modal and controls
function initSettings() {
  const settingsBtn = document.getElementById('settingsBtn');
  const modal = document.getElementById('settingsModal');
  const closeBtn = document.getElementById('closeSettings');
  const hapticsToggle = document.getElementById('hapticsToggle');
  const celebrationLevel = document.getElementById('celebrationLevel');
  const celebrationValue = document.getElementById('celebrationValue');

  // Load stored preferences
  const hapticsStored = localStorage.getItem('hapticsEnabled');
  if (hapticsToggle) {
    if (hapticsStored === null) {
      localStorage.setItem('hapticsEnabled', 'true');
      hapticsToggle.checked = true;
    } else {
      hapticsToggle.checked = hapticsStored === 'true';
    }
    hapticsToggle.addEventListener('change', (e) => {
      localStorage.setItem('hapticsEnabled', e.target.checked ? 'true' : 'false');
    });
  }

  // Celebration level slider
  const storedLevel = localStorage.getItem('celebrationLevel');
  const levelVal = storedLevel === null ? 60 : parseInt(storedLevel, 10) || 60;
  if (celebrationLevel) {
    celebrationLevel.value = levelVal;
    if (celebrationValue) celebrationValue.textContent = celebrationLevel.value;
    celebrationLevel.addEventListener('input', (e) => {
      const v = e.target.value;
      if (celebrationValue) celebrationValue.textContent = v;
    });
    celebrationLevel.addEventListener('change', (e) => {
      localStorage.setItem('celebrationLevel', e.target.value);
    });
  }

  // Theme selector
  const themeSelect = document.getElementById('themeSelect');
  const storedTheme = localStorage.getItem('theme') || 'default';
  try {
    applyTheme(storedTheme);
    if (themeSelect) themeSelect.value = storedTheme;
  } catch (e) {}
  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      const t = e.target.value || 'default';
      localStorage.setItem('theme', t);
      applyTheme(t);
    });
  }

  // Open/close modal
  if (settingsBtn && modal) {
    settingsBtn.addEventListener('click', () => {
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
    });
  }
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
    });
  }
  // close modal when clicking outside content
  if (modal) {
    modal.addEventListener('click', (ev) => {
      if (ev.target === modal) {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  }
}

// Initialize settings after DOM is ready
try { initSettings(); } catch (e) { /* ignore */ }

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
    // Respect user preference stored in localStorage
    const pref = localStorage.getItem('hapticsEnabled');
    if (pref === 'false') return;

    // If the Vibration API is available, use it
    if (navigator && typeof navigator.vibrate === 'function') {
      navigator.vibrate(pattern);
      return;
    }

    // Fallback: Play a short, quiet audio 'tap' to mimic haptics (useful on iOS/Safari)
    // pattern may be a number or an array; pick the first duration
    const dur = Array.isArray(pattern) ? (pattern[0] || 20) : pattern;
    playHapticAudio(dur);
  } catch (e) {
    // ignore
  }
}

// Audio fallback for devices that don't support vibration (e.g., some iOS Safari builds)
function playHapticAudio(durationMs = 20) {
  try {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return; // no Web Audio API

    // Lazy-create a shared AudioContext to avoid creating one per tap
    if (!window._hapticAudioCtx) {
      window._hapticAudioCtx = new C();
    }
    const ctx = window._hapticAudioCtx;

    // Many mobile browsers require the AudioContext to be resumed after a user gesture
    if (ctx.state === 'suspended') {
      // resume returns a promise; don't await here to keep things fast
      ctx.resume().catch(() => {});
    }

    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    // Frequency chosen to be short and low so it feels like a soft tap
    o.frequency.value = 150;
    g.gain.value = 0.0001;

    o.connect(g);
    g.connect(ctx.destination);

    const now = ctx.currentTime;
    // tiny attack to avoid clicks, then quick decay
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.6, now + 0.005);
    o.start(now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + (durationMs / 1000));
    // stop slightly after to allow the ramp to complete
    o.stop(now + (durationMs / 1000) + 0.02);
    o.onended = () => {
      try { o.disconnect(); g.disconnect(); } catch (err) {}
    };
  } catch (e) {
    // ignore any audio errors (silently fail-safe)
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

// Theme application helper
function applyTheme(theme) {
  try {
    const body = document.body;
    // Remove known theme classes
    body.classList.remove('theme-dark', 'theme-colorful', 'theme-retro');
    if (!theme || theme === 'default') {
      // default theme: nothing to add
      return;
    }
    // add the selected theme class (expects values like 'dark', 'colorful', 'retro')
    body.classList.add('theme-' + theme);
  } catch (e) {
    // ignore
  }
}

// Adjust the good text position when the keyboard hint is visible on wide screens
function updateGoodTextShift() {
  try {
    const hint = document.getElementById('keyboardHint');
    const gc = document.querySelector('.good-container');
    if (!hint || !gc) return;

    const computed = window.getComputedStyle(hint);
    const hintVisible = computed.display !== 'none' && hint.getBoundingClientRect().height > 0 && hint.offsetParent !== null;
    const wideScreen = window.innerWidth > 800;

    if (hintVisible && wideScreen) gc.classList.add('hint-visible-shift');
    else gc.classList.remove('hint-visible-shift');
  } catch (e) {
    // fail silently
  }
}

// Update on resize and run once during initialization
window.addEventListener('resize', updateGoodTextShift);
try { updateGoodTextShift(); } catch (e) {}
