let particles = [];

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  for (let i = 0; i < 500; i++) {
    particles[i] = new Particle(width / 2, height / 2, random(10, 30));
  }

}

function draw() {
  background(220);

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i]; // each element
    p.move();
    p.display();
  }
}

///// CLASS (Blueprint! Design, Plan) /////

class Particle {
  constructor(x, y, dia) {
    this.x = x;
    this.y = y;
    this.dia = dia;

    this.xSpeed = random(-3, 3);
    this.ySpeed = random(-3, 3);

    this.r = 255;
    this.g = 255;
    this.b = 255;
  }
  move() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }
  display() {
    push();
    circle(this.x, this.y, this.dia);
    pop();
  }
}