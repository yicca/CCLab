let particles = [];

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  background(0);

  for (let i = 0; i < 500; i++) {
    //
  }
}

function draw() {
  //background(0);

  particles.push(new Particle(mouseX, mouseY, random(5, 10)));

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i]; // each element
    p.move();
    //p.moveZigzag();
    p.slowDown();
    p.reappear();
    p.display();
  }
}

///// CLASS (Blueprint! Design, Plan) /////

class Particle {
  constructor(x, y, dia) {
    this.x = x;
    this.y = y;
    this.dia = dia;

    this.xSpeed = 0;
    this.ySpeed = random(0.5, 2);

    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
  }
  move() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }
  moveZigzag() {
    this.x += random(-1, 1);
  }
  reappear() {
    if (this.y > height + 30) {
      this.y = -30;
    }
  }
  slowDown() {
    this.ySpeed *= 0.98; //(-2%)
  }
  display() {
    push();
    noStroke();
    fill(this.r, this.g, this.b, 100);
    circle(this.x, this.y, this.dia);
    circle(this.x, this.y, this.dia / 2);
    pop();
  }
}