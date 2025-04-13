let particles = []; // empty array

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");

  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = random(300, 350);
    let d = random(5, 15);

    let newP = new Particle(x, y, d);
    particles.push(newP);
  }
}

function draw() {
  background(0, 10, 50, 50);

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i]; // get each particle
    p.move();
    p.swing();
    p.reappear();
    p.display();
  }
}



class Particle {
  constructor(x, y, dia) {
    this.x = x;
    this.y = y;
    this.dia = dia;
    //
    this.xSpeed = 0;
    this.ySpeed = random(-1, -0.1);
    //
    this.diaFreq = random(0.07, 0.12);
  }
  move() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }
  swing() {
    this.x += random(-0.3, 0.3);
  }
  reappear() {
    if (this.y < -50) {
      this.y = height + 50;
    }
  }
  display() {
    let diaAdj = sin(frameCount * this.diaFreq) * 2;
    push();
    translate(this.x, this.y);

    stroke(255, 150);
    fill(255, 50);
    circle(0, 0, this.dia + diaAdj);

    pop();
  }
}