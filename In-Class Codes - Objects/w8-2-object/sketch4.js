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

  creatureB.display();
}

///// CLASS (Blueprint! Design, Plan) /////

class Creature {
  constructor(tempX, tempY, dia) {
    this.x = tempX;
    this.y = tempY;
    this.dia = dia;
  }
  display() {
    circle(this.x, this.y, this.dia);
  }
}