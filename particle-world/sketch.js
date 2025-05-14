// CCLab Mini Project - 9.R Particle World Template

let NUM_OF_PARTICLES = 20; // Decide the initial number of particles.
let MAX_OF_PARTICLES = 500; // Decide the maximum number of particles.

let particles = [];
let sec = 0;

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");

  // generate particles
  for (let i = 0; i < 0; i++) {
    let angle = random(180, 360);
    let startX = cos(angle) * 98 + 396;
    let startY = sin(angle) * 98 + 205;
    particles[i] = new Particle(startX, startY);
  }

  angleMode(DEGREES);
}

function draw() {
  background(220);

  let angle = random(0, 180);
  let startX = cos(angle) * 98 + 396;
  let startY = sin(angle) * 98 + 205;

  particles.push(new Particle(startX, startY));

  drawClock(400, 200);
  // consider generating particles in draw(), using Dynamic Array

  // update and display
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.update();
    p.display();
  }

  // limit the number of particles
  if (particles.length > MAX_OF_PARTICLES) {
    particles.splice(0, 1); // remove the first (oldest) particle
  }
}

function drawClock(x, y) {
  push();
  translate(x, y);

  let alp = map(sin(frameCount), -1, 1, 20, 220);

  // bg
  strokeWeight(10);
  stroke(0);
  fill(255);
  circle(0, 0, 200);

  // hand(s)
  let xHand = cos(sec) * 70;
  let yHand = sin(sec) * 70;
  strokeWeight(3);
  stroke(0, alp);
  line(0, 0, xHand, yHand);
  sec++;

  for (i = 0; i < 360; i += 30) {
    noStroke();
    fill(0, alp);
    circle(cos(i + frameCount * -0.3) * 120, sin(i + frameCount * -0.3) * 120, 3);
  }

  pop();
}

class Particle {
  // constructor function
  constructor(x, y, dia) {
    // properties (variables): particle's characteristics
    this.x = x;
    this.y = y;
    this.acc = 0.002;

    this.ySpeed = 1;

    this.lifeSpan = 600;
    this.time = random(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12",]);
  }
  // methods (functions): particle's behaviors
  update() {
    this.ySpeed -= this.acc;
    this.y += this.ySpeed;
    this.lifeSpan -= 1;
  }
  display() {
    // particle's appearance
    push();
    translate(this.x, this.y);
    let alpha = map(this.y, 250, 500, 255, 0);

    noStroke();
    fill(0, alpha);
    textFont('Courier New')
    text(this.time, 0, 0);

    pop();
  }
}
