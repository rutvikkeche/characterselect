# Driver Select Screen

Static character/driver select screen with left/right arrow navigation and background music. Pure HTML/CSS/JS — no build step, deploys straight to GitHub Pages.

## Folder structure

```
├── index.html
├── style.css
├── script.js
├── images/
│   ├── 1.jpeg
│   ├── 2.jpeg
│   ├── 3.jpeg
│   └── ... (add more, keep numbering sequential, no gaps)
└── audio/
    ├── theme.mp3
    └── click.mp3
```

## Per-image background color

Each driver image can have its own background color. Edit the `BG_COLORS`
map near the top of `script.js`:

```js
const BG_COLORS = {
  1: "#ffb6c1", // pink
  2: "#a2d2ff", // blue
  3: "#ffffff",
  // ...one entry per image number
};
const DEFAULT_BG_COLOR = "#ffffff"; // used for any image with no entry above
```

Just send me the image number → hex pairs and I'll fill these in directly,
or edit them yourself — no other code changes needed. The background
crossfades (0.25s) when switching drivers.

## Adding more drivers

Just drop the next numbered file into `images/`, e.g. `images/6.jpeg`.
The script probes `1.jpeg, 2.jpeg, ...` on page load and stops at the
first missing number, so it auto-detects however many you have — no
code edits required.

If your images use a different extension, change this line in `script.js`:

```js
const IMAGE_EXT = "jpeg";
```

## Music

Put your track at `audio/theme.mp3` (or update the `src` in
`index.html`'s `<audio>` tag to match your filename). Browsers block
autoplay with sound until the user interacts with the page, so the
music kicks in when the person clicks **Start** or the speaker icon.
The speaker icon toggles mute/unmute after that. It has the `loop`
attribute set, so it repeats automatically once it finishes.

### Click sound

Put a short UI click sound at `audio/click.mp3`. It plays on:
- Left/Right arrow keys
- The on-screen arrow buttons
- The Start button
- The speaker/mute button

It's implemented by cloning the audio node on every click (see
`playClickSound()` in `script.js`), so rapid clicks or holding down an
arrow key won't cut previous plays short. To change the file, edit
`CLICK_SOUND_PATH` at the top of `script.js`.

## Controls

- **Left / Right arrow keys** — cycle through drivers (wraps around)
- **On-screen arrow buttons** — same as above, for touch/mouse
- **Speaker icon** — start music (first click) / mute-unmute (after)
- **Start button** — starts music if not already playing, then fires
  your own "confirm selection" logic (see `startBtn` click handler in
  `script.js` — that's where you'd navigate to the next screen or
  set the chosen driver in state)

## Deploying to GitHub Pages

1. Push this folder to a repo (root, or a `/docs` folder).
2. Repo Settings → Pages → set source to that branch/folder.
3. Done — no build tooling needed.
