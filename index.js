const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const countdownEl = document.getElementById("countdown");
const messageEl = document.getElementById("message");
messageEl.style.display = "none";

let showFireworks = false; // Controla a exibição dos fogos de artifício

const targetDate = new Date("2024-12-21T00:00:01").getTime();

function Particle(x, y, color, angle, speed) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.angle = angle;
  this.speed = speed;
  this.opacity = 1;
  this.gravity = 0.05;
  this.velocityX = Math.cos(this.angle) * this.speed;
  this.velocityY = Math.sin(this.angle) * this.speed;
}

Particle.prototype.update = function () {
  this.velocityY += this.gravity;
  this.x += this.velocityX;
  this.y += this.velocityY;
  this.opacity -= 0.02;
};

Particle.prototype.draw = function () {
  ctx.globalAlpha = this.opacity;
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
};

function Firework(x, y) {
  this.x = x;
  this.y = y;
  this.particles = [];
  for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 1;
    const color = `hsl(${Math.random() * 360}, 80%, 50%)`;
    this.particles.push(new Particle(this.x, this.y, color, angle, speed));
  }
}

Firework.prototype.update = function () {
  this.particles.forEach((particle) => particle.update());
  this.particles = this.particles.filter((particle) => particle.opacity > 0);
};

Firework.prototype.draw = function () {
  this.particles.forEach((particle) => particle.draw());
};

const fireworks = [];
setInterval(() => {
  if (showFireworks) {
    // Só gera fogos se permitido
    const x = Math.random() * canvas.width;
    const y = (Math.random() * canvas.height) / 2;
    fireworks.push(new Firework(x, y));
  }
}, 500);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (showFireworks) {
    // Só exibe fogos se permitido
    fireworks.forEach((firework, index) => {
      firework.update();
      firework.draw();
      if (firework.particles.length === 0) {
        fireworks.splice(index, 1);
      }
    });
  }

  requestAnimationFrame(animate);
}

const message = "Feliz Aniversário!\nMuitos Anos de Vida Cleitim!!!!";
const letters = [];
const lineHeight = 70;
const letterSpacing = 30;

message.split("\n").forEach((line, lineIndex) => {
  const startY =
    canvas.height / 2 -
    (message.split("\n").length * lineHeight) / 2 +
    lineIndex * lineHeight;
  const startX = canvas.width / 2 - (line.length * letterSpacing) / 2;

  Array.from(line).forEach((char, charIndex) => {
    const x = startX + charIndex * letterSpacing;
    const y = startY;
    const color = `hsl(${Math.random() * 360}, 80%, 60%)`;
    letters.push({ char, x, y, color });
  });
});

function drawMessage() {
  ctx.font = "50px Arial";
  ctx.textAlign = "center";

  letters.forEach((letter) => {
    ctx.fillStyle = letter.color;
    ctx.fillText(letter.char, letter.x, letter.y);
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw fireworks in the background
  fireworks.forEach((firework, index) => {
    firework.update();
    firework.draw();
    if (firework.particles.length === 0) {
      fireworks.splice(index, 1);
    }
  });

  // Draw the message in the foreground
  if (messageEl.style.display === "block") {
    drawMessage();
  }

  requestAnimationFrame(animate);
}

function updateCountdown() {
  const now = new Date().getTime();
  const timeLeft = targetDate - now;

  if (timeLeft <= 0) {
    countdownEl.style.display = "none";
    messageEl.style.display = "block";
    showFireworks = true;
    clearInterval(interval);
  } else {
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    countdownEl.textContent = `${hours}h ${minutes}m ${seconds}s`;
  }
}

const interval = setInterval(updateCountdown, 1000);
updateCountdown(); // Ensure the countdown starts immediately
animate();
