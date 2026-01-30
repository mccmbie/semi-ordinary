window.addEventListener("load", () => {
  const heading = document.getElementById("main-heading");
  if (!heading) return;

  // Start at no rotation
  heading.style.transform = "rotateX(0deg) rotateY(0deg)";
  heading.style.transition = "transform 5000ms ease-in-out";

  // Animate spin after a tiny delay
  setTimeout(() => {
    heading.style.transform = "rotateX(1080deg) rotateY(3600deg) rotateZ(1080deg)";
  }, 50);
});

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("generate-btn");
  const output = document.getElementById("output");

  async function getRandomWord() {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];

    try {
      const response = await fetch(
        `https://api.datamuse.com/words?sp=${randomLetter}*&max=1000`
      );
      const data = await response.json();

      const randomIndex = Math.floor(Math.random() * data.length);
      output.textContent = data[randomIndex].word;
    } catch (error) {
      output.textContent = "Error fetching word";
      console.error(error);
    }
  }

  button.addEventListener("click", getRandomWord);
});
const box = document.getElementById("reaction-box");
const currentTimeEl = document.getElementById("current-time");
const bestTimeEl = document.getElementById("best-time");
const failMessage = document.getElementById("fail-message");

let startTime = null;
let timeoutId = null;
let bestTime = null;

function startGame() {
  box.style.background = "#444";
  startTime = null;
  failMessage.style.opacity = 0;

  const delay = Math.random() * 3000 + 1000;

  timeoutId = setTimeout(() => {
    box.style.background = "#2ecc71";
    startTime = performance.now();
  }, delay);
}

box.addEventListener("click", () => {
  // Clicked too early
  if (!startTime) {
    clearTimeout(timeoutId);
    failMessage.style.opacity = 1;
    startGame();
    return;
  }

  const reactionTime = Math.round(performance.now() - startTime);
  currentTimeEl.textContent = `${reactionTime} ms`;

  if (bestTime === null || reactionTime < bestTime) {
    bestTime = reactionTime;
    bestTimeEl.textContent = `${bestTime} ms`;
  }

  startGame();
});

startGame();

const canvas = document.getElementById("draw-canvas");
const ctx = canvas.getContext("2d");

const drawToggle = document.getElementById("draw-toggle");
const eraseBtn = document.getElementById("erase");

let drawingEnabled = false;
let drawing = false;

// Resize canvas correctly
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.scale(dpr, dpr);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Convert mouse position to canvas coords
function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

// Toggle drawing
drawToggle.addEventListener("click", () => {
  drawingEnabled = !drawingEnabled;
  drawToggle.classList.toggle("active", drawingEnabled);
  canvas.style.pointerEvents = drawingEnabled ? "auto" : "none";
});

// Mouse events


canvas.addEventListener("mousemove", (e) => {
  if (!drawing || !drawingEnabled) return;
  const pos = getMousePos(e);

  ctx.lineTo(pos.x, pos.y);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();

  // Call driftElements function to update the position of the elements
  driftElements();
});

canvas.addEventListener("mouseup", () => {
  drawing = false;
});

canvas.addEventListener("mousedown", (e) => {
  if (!drawingEnabled) return;
  drawing = true;
  const pos = getMousePos(e);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
});


canvas.addEventListener("mouseleave", () => {
  drawing = false;
});

// Erase
eraseBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});


function driftElements() {
  const elements = function getDriftTargets() {
  return Array.from(document.body.querySelectorAll("*")).filter(el => {
    return (
      el.id !== "draw-canvas" &&
      el.id !== "draw-controls" &&
      !el.closest("#draw-controls")
    );
  });
}
;

  elements.forEach(el => {
    // Read previous drift values
    const currentX = el.dataset.driftX ? parseFloat(el.dataset.driftX) : 0;
    const currentY = el.dataset.driftY ? parseFloat(el.dataset.driftY) : 0;

    // Small random movement
    const dx = (Math.random() - 0.5) * 2;
    const dy = (Math.random() - 0.5) * 2;

    const newX = currentX + dx;
    const newY = currentY + dy;

    el.dataset.driftX = newX;
    el.dataset.driftY = newY;

    el.style.transform = `${el.dataset.baseTransform || ""} translate(${newX}px, ${newY}px)`;
  });
}

window.addEventListener("load", () => {
  getDriftTargets().forEach(el => {
    el.dataset.baseTransform = getComputedStyle(el).transform === "none"
      ? ""
      : getComputedStyle(el).transform;
  });
});


function getDriftTargets() {
  return Array.from(document.body.children).filter(el => {
    return (
      el.id !== "draw-canvas" &&
      el.id !== "draw-controls"
    );
  });
}
