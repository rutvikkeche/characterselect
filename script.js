/* =========================================================
   CHARACTER SELECT SCRIPT
   -----------------------------------------------------------
   - Images live in /images/ and MUST be named 1.jpeg, 2.jpeg,
     3.jpeg, ... in sequence (no gaps). To add a new driver,
     just drop in the next number (e.g. images/6.jpeg) — no
     code changes needed.
   - IMAGE_EXT below controls the file extension it looks for.
   - MAX_IMAGES_TO_CHECK is just a safety ceiling for the
     auto-detect probe, raise it if you'll have more than 50.
   ========================================================= */

const IMAGE_FOLDER = "images";
const IMAGE_EXT = "jpeg";
const MAX_IMAGES_TO_CHECK = 50;
const CLICK_SOUND_PATH = "audio/click.mp3";

// Background color per driver image, keyed by image number.
// Fill in a hex code for each image you have; any image without an
// entry here falls back to DEFAULT_BG_COLOR.
const BG_COLORS = {
  1: "#fafafa",
  2: "#ffffff",
  3: "#f8f8f8",
  4: "#f7f5f5",
  5: "#f7f5f5",
  6: "#fafafa",
  7: "#f8f7f7",
  8: "#f8f7f8",
};
const DEFAULT_BG_COLOR = "#fafafa";

let imageCount = 0;
let currentIndex = 0;

const bgImage = document.getElementById("bg");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const muteBtn = document.getElementById("muteBtn");
const startBtn = document.getElementById("startBtn");
const bgMusic = document.getElementById("bgMusic");

// --- Click sound effect ---
// A fresh clone is played each time so rapid-fire clicks (e.g. holding
// down an arrow key) don't cut the previous click sound off.
const clickSoundTemplate = new Audio(CLICK_SOUND_PATH);
clickSoundTemplate.preload = "auto";

function playClickSound() {
  const sfx = clickSoundTemplate.cloneNode();
  sfx.play().catch(() => {
    /* Ignored: some browsers block audio before any user gesture. */
  });
}

// --- Detect how many sequential images exist ---
function checkImageExists(index) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = `${IMAGE_FOLDER}/${index}.${IMAGE_EXT}`;
  });
}

async function detectImageCount() {
  let count = 0;
  for (let i = 1; i <= MAX_IMAGES_TO_CHECK; i++) {
    const exists = await checkImageExists(i);
    if (!exists) break;
    count = i;
  }
  return count;
}

function showImage(index) {
  bgImage.src = `${IMAGE_FOLDER}/${index}.${IMAGE_EXT}`;
  const color = BG_COLORS[index] || DEFAULT_BG_COLOR;
  document.body.style.backgroundColor = color;
  document.querySelector(".screen").style.backgroundColor = color;
}

function goNext() {
  if (imageCount === 0) return;
  currentIndex = (currentIndex % imageCount) + 1; // wraps 1..imageCount
  showImage(currentIndex);
}

function goPrev() {
  if (imageCount === 0) return;
  currentIndex = currentIndex - 1 < 1 ? imageCount : currentIndex - 1;
  showImage(currentIndex);
}

// --- Arrow key + button navigation ---
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    playClickSound();
    goNext();
  }
  if (e.key === "ArrowLeft") {
    playClickSound();
    goPrev();
  }
});

nextBtn.addEventListener("click", () => {
  playClickSound();
  goNext();
});

prevBtn.addEventListener("click", () => {
  playClickSound();
  goPrev();
});

// --- Music controls ---
let musicStarted = false;

function playMusic() {
  bgMusic.muted = false;
  bgMusic.play().catch(() => {
    /* Autoplay was blocked; user can hit the sound icon to retry. */
  });
  musicStarted = true;
  muteBtn.classList.remove("muted");
}

muteBtn.addEventListener("click", () => {
  playClickSound();
  if (!musicStarted) {
    playMusic();
    return;
  }
  bgMusic.muted = !bgMusic.muted;
  muteBtn.classList.toggle("muted", bgMusic.muted);
});

startBtn.addEventListener("click", () => {
  playClickSound();
  if (!musicStarted) playMusic();

  // Hook your actual "start game / next screen" logic here.
  console.log(`Starting with driver ${currentIndex}`);
});

// --- Init ---
(async function init() {
  imageCount = await detectImageCount();
  if (imageCount === 0) {
    console.warn(
      `No images found in "${IMAGE_FOLDER}/" named 1.${IMAGE_EXT}, 2.${IMAGE_EXT}, etc.`
    );
    return;
  }
  currentIndex = 1;
  showImage(currentIndex);
})();
