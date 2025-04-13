let particles = []; // empty array

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
}

function draw() {
  background(220);

  // generate particles!
  particles.push(new Particle(width / 2, height / 2, random(5, 20)));

  // update and display them!
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.move();
    p.checkOutOfCanvas();
    p.display();
  }

  // remove if the particle is done!
  for (let i = particles.length - 1; i >= 0; i--) {
    // FLIP THE DIRECTION OF FOR LOOP!
    let p = particles[i];
    if (p.isDone) {
      // remove it FROM THE ARRAY, using INDEX!
      particles.splice(i, 1); // (index, howMany = 1)
    }
  }

  // limit the number of particles
  while (particles.length > 1000) {
    //remove one!
    particles.splice(0, 1); //(index, howMany = 1)
  }

  //text(round(frameRate()), 10, 20);
  text(particles.length, 10, 20);
}

class Particle {
  constructor(x, y, dia) {
    this.x = x;
    this.y = y;
    this.dia = dia;
    //
    this.xSpeed = random(-3, 3);
    this.ySpeed = random(-3, 3);
    //
    this.r = 255;
    this.g = 255;
    this.b = 255;
    //
    this.isDone = false;
  }
  move() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }
  checkOutOfCanvas() {
    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      // out of canvas!
      this.r = 255;
      this.g = 0;
      this.b = 0;

      this.isDone = true;
    }
  }
  display() {
    push();
    translate(this.x, this.y);

    fill(this.r, this.g, this.b);
    circle(0, 0, this.dia);

    pop();
  }
}

