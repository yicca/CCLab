let b;

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");

  b = new Ball();
}

function draw() {
  background(220);

  //text(b.x, 10, 20);
  //text(b.y, 10, 40);
  //text(b.dia, 10, 60);

  // display!
  displayBall();
}

function displayBall() {
  circle(b.x, b.y, b.dia);
}


///// CLASS (Blueprint! Design, Plan) /////

class Ball {
  constructor() {
    // properties (variables)
    this.x = width / 2;
    this.y = height / 2;
    this.dia = 100;
  }
}



