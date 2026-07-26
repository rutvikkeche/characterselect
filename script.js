/* =========================================================
   CHARACTER SELECT SCRIPT
   -----------------------------------------------------------
   - Images live in /images/ and MUST be named 1.jpeg, 2.jpeg,
     3.jpeg, ... in sequence (no gaps). To add a new driver,
     just drop in the next number (e.g. images/9.jpeg) — no
     code changes needed.
   - IMAGE_EXT below controls the file extension it looks for.
   - MAX_IMAGES_TO_CHECK is just a safety ceiling for the
     auto-detect probe, raise it if you'll have more than 50.
   - Left/Right ARROW KEYS switch drivers (no on-screen arrow
     buttons — keyboard only, per current design).
   - Background music autoplays and loops, with no mute/toggle
     button. Browsers block unmuted autoplay before any user
     interaction, so if the initial play() attempt is blocked,
     it kicks in silently on the user's very first click, key
     press, or tap anywhere on the page.
   ========================================================= */

const IMAGE_FOLDER = "images";
const IMAGE_EXT = "jpg";
const MAX_IMAGES_TO_CHECK = 50;
const CLICK_SOUND_PATH = "audio/click.mp3";

// Single full-page background image, sits behind the whole scene.
// Set to a path like "images/page-bg.jpg" once you have the file, or
// leave as null to just use a flat color (falls back to DEFAULT_BG_COLOR).
const PAGE_BG_IMAGE = "images/page_bg.jpg";;

// Background color per driver image, keyed by image number.
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
const frame = document.getElementById("frame");
const pageBg = document.getElementById("pageBg");
const bgMusic = document.getElementById("bgMusic");

if (PAGE_BG_IMAGE) {
  pageBg.style.backgroundImage = `url("${PAGE_BG_IMAGE}")`;
}

// --- Click sound effect ---
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
  frame.style.backgroundColor = color;
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

// --- Arrow key navigation (keyboard only, no on-screen buttons) ---
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

// --- Music: always playing, no toggle ---
let musicStarted = false;

function playMusic() {
  bgMusic.play()
    .then(() => {
      musicStarted = true;
    })
    .catch(() => {
      /* Blocked until a user gesture happens; the listener below retries. */
    });
}

// Try immediately on load...
playMusic();

// ...and if the browser blocked that, start on the very first interaction.
function startMusicOnFirstInteraction() {
  if (!musicStarted) playMusic();
  document.removeEventListener("click", startMusicOnFirstInteraction);
  document.removeEventListener("keydown", startMusicOnFirstInteraction);
  document.removeEventListener("touchstart", startMusicOnFirstInteraction);
}
document.addEventListener("click", startMusicOnFirstInteraction);
document.addEventListener("keydown", startMusicOnFirstInteraction);
document.addEventListener("touchstart", startMusicOnFirstInteraction);

// --- Init ---
(async function init() {
  imageCount = await detectImageCount();
  if (imageCount === 0) {
    console.warn(
      `No images found in "${IMAGE_FOLDER}/" named 1.${IMAGE_EXT}, 2.${IMAGE_EXT}, etc. Add your image files there.`
    );
    return;
  }
  currentIndex = 1;
  showImage(currentIndex);
})();
