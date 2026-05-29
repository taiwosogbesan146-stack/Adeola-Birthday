const canvas = document.querySelector("#confetti-canvas");
const ctx = canvas.getContext("2d");
const celebrateButtons = document.querySelectorAll("[data-celebrate]");
const wishButton = document.querySelector("[data-wish]");
const wishSection = document.querySelector(".wish-section");
let confetti = [];
let width = 0;
let height = 0;
let animationFrame = null;
const colors = ["#f46f9e", "#ffd166", "#8ee3c8", "#7cc7ff", "#d8c2ff", "#ff8b79"];
function resizeCanvas() {
  const scale = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * scale;
  canvas.height = height * scale;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
}
function makePiece(x = width / 2, y = height * 0.2) {
  return {
    x,
    y,
    size: 7 + Math.random() * 9,
    color: colors[Math.floor(Math.random() * colors.length)],
    speedX: (Math.random() - 0.5) * 13,
    speedY: Math.random() * -9 - 4,
    gravity: 0.22 + Math.random() * 0.08,
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 0.24,
    life: 130 + Math.random() * 50,
    shape: Math.random() > 0.5 ? "circle" : "rect",
  };
}
function burst(amount = 160, x = width / 2, y = height * 0.24) {
  for (let i = 0; i < amount; i += 1) {
    confetti.push(makePiece(x, y));
  }
  if (!animationFrame) {
    animateConfetti();
  }
}
function animateConfetti() {
  ctx.clearRect(0, 0, width, height);
  confetti = confetti.filter((piece) => {
    piece.x += piece.speedX;
    piece.y += piece.speedY;
    piece.speedY += piece.gravity;
    piece.rotation += piece.spin;
    piece.life -= 1;
    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.rotation);
    ctx.fillStyle = piece.color;
    if (piece.shape === "circle") {
      ctx.beginPath();
      ctx.arc(0, 0, piece.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.62);
    }
    ctx.restore();
    return piece.life > 0 && piece.y < height + 40;
  });
  if (confetti.length) {
    animationFrame = requestAnimationFrame(animateConfetti);
  } else {
    animationFrame = null;
  }
}
function createSparkles(originX, originY) {
  for (let i = 0; i < 24; i += 1) {
    const spark = document.createElement("span");
    const angle = (Math.PI * 2 * i) / 24;
    const distance = 42 + Math.random() * 72;
    spark.className = "spark";
    spark.style.left = `${originX}px`;
    spark.style.top = `${originY}px`;
    spark.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    spark.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
    spark.style.background = colors[i % colors.length];
    document.body.appendChild(spark);
    spark.addEventListener("animationend", () => spark.remove());
  }
}
celebrateButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const rect = button.getBoundingClientRect();
    burst(190, rect.left + rect.width / 2, rect.top + rect.height / 2);
  });
});
wishButton.addEventListener("click", () => {
  const rect = wishButton.getBoundingClientRect();
  wishSection.classList.remove("is-lit");
  void wishSection.offsetWidth;
  wishSection.classList.add("is-lit");
  createSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2);
  burst(120, rect.left + rect.width / 2, rect.top);
});
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
window.setTimeout(() => burst(130, width * 0.5, height * 0.18), 650);