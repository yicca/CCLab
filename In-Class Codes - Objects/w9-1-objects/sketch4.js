let particles = []; // empty array

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");

  for (let i = 0; i < 500; i++) {
    let x = random(width);
    let y = random(-500, 0);
    let d = random(30, 100);

    let newP = new Particle(x, y, d);
    particles.push(newP);
  }
}

function draw() {
  background(0, 30);

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i]; // get each particle
    p.move();
    //p.swing();
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
    this.ySpeed = random(2, 3);
    //
    this.diaFreq = random(0.07, 0.12);
    //
    this.r = random(200, 255);
    this.g = random(200, 255);
    this.b = random(200, 255);
  }
  move() {
    //let yAdj = map(mouseY, 0, height, -1, 1);
    this.x += this.xSpeed;
    //this.y += this.ySpeed + yAdj;
    this.y += this.ySpeed;
  }
  swing() {
    this.x += random(-0.3, 0.3);
  }
  reappear() {
    if (this.y < -50) {
      this.y = height + 50;
    }
    else if (this.y > height + 50) {
      this.y = - 50;
    }
  }
  display() {
    let diaAdj = sin(frameCount * this.diaFreq) * 2;
    push();
    translate(this.x, this.y);

    stroke(this.r, this.g, this.b, 100);
    line(0, 0, 0, -this.dia);
    //circle(0, 0, this.dia + diaAdj);

    pop();
  }
}