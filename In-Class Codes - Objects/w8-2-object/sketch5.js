let creatureA, creatureB;

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");

  creatureA = new Creature(200, 250, 100);
  creatureB = new Creature(600, 250, 120);
}

function draw() {
  background(220);

  creatureA.display();
  creatureA.drawArm();

  creatureB.display();
  creatureB.drawArm();
}

///// CLASS (Blueprint! Design, Plan) /////

class Creature {
  constructor(tempX, tempY, dia) {
    this.x = tempX;
    this.y = tempY;
    this.dia = dia;
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
  }
  display() {
    fill(this.r, this.g, this.b);
    circle(this.x, this.y, this.dia);
  }
  drawArm() {
    ellipse(this.x - 100, this.y, 100, 30);
  }
}