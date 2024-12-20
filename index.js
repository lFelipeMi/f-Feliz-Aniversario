const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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
  const x = Math.random() * canvas.width;
  const y = (Math.random() * canvas.height) / 2;
  fireworks.push(new Firework(x, y));
}, 500);

const message = "Feliz Aniversário!\nMuitos Anos de Vida Cleitim!!!!";
const letters = [];
const lineHeight = 60;

message.split("\n").forEach((line, lineIndex) => {
  const textWidth = ctx.measureText(line).width;
  const startX = (canvas.width - textWidth) / 2;
  const startY =
    canvas.height / 2 - (message.split("\n").length * lineHeight) / 2;

  Array.from(line).forEach((char, charIndex) => {
    const x = startX + charIndex * 20;
    const y = startY + lineIndex * lineHeight;
    letters.push({ char, x, y });
  });
});

function drawMessage() {
  ctx.font = "48px Arial";
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  const startY =
    canvas.height / 2 - (message.split("\n").length * lineHeight) / 2;

  message.split("\n").forEach((line, lineIndex) => {
    ctx.fillText(line, canvas.width / 2, startY + lineIndex * lineHeight);
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  fireworks.forEach((firework, index) => {
    firework.update();
    firework.draw();
    if (firework.particles.length === 0) {
      fireworks.splice(index, 1);
    }
  });

  drawMessage();

  requestAnimationFrame(animate);
}

animate();
