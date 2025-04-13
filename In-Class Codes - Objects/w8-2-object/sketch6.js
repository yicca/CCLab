let creatureA, creatureB;

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");

  creatureA = new Creature(200, 250, 80);
  creatureB = new Creature(600, 250, 200);
}

function draw() {
  background(220);

  creatureA.display();
  creatureB.display();
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
    push();
    translate(this.x, this.y);

    // draw Body
    fill(this.r, this.g, this.b);
    circle(0, 0, this.dia);
    // draw arms

    let sinValue = sin(frameCount * 0.1) * 30;
    this.drawArm(-30 + sinValue); // ***
    this.drawArm(210 - sinValue); // ***
    pop();
  }
  drawArm(deg) {
    push();
    rotate(radians(deg));
    ellipse(this.dia, 0, this.dia, 30);
    pop();
  }
}