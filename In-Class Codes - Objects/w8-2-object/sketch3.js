let b;

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");

  b = new Ball();
}

function draw() {
  background(220);

  b.move();
  b.display();
}

///// CLASS (Blueprint! Design, Plan) /////

class Ball {
  constructor() {
    // properties (variables)
    this.x = width / 2;
    this.y = height / 2;
    this.dia = 100;
    //
    this.xSpeed = random(-2, 2);
    this.ySpeed = random(-2, 2);
  }
  // methods: actions, behaviors (functions)
  display() {
    circle(this.x, this.y, this.dia)
  }
  move() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }
}



