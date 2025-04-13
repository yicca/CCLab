let particles = []; // empty array

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
}

function draw() {
  background(100);

  // generate particles!
  particles.push(new Particle(width / 2, height / 2, random(5, 20)));

  // update and display them!
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.move();
    p.checkOutOfCanvas();
    p.age();
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
    this.lifespan = 1.0; // 100%
    this.lifeReduction = random(0.007, 0.012); // 0.7% ~ 1.2%
    this.isDone = false;
  }
  move() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }
  age() {
    this.lifespan -= this.lifeReduction;
    if (this.lifespan < 0) {
      this.lifespan = 0;
      this.isDone = true;
    }
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

    noStroke();
    fill(this.r, this.g, this.b, 255 * this.lifespan);
    circle(0, 0, this.dia);

    //fill(255, 0, 0);
    //text(this.lifespan.toFixed(2), 20, 0);

    pop();
  }
}

