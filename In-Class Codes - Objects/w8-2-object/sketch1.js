let x, y, dia;
let xSpeed, ySpeed;

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");

  x = width / 2;
  y = height / 2;
  dia = 200;
  xSpeed = random(-1, 1);
  ySpeed = random(-1, 1);
}

function draw() {
  background(220);

  // move
  x += xSpeed;
  y += ySpeed;

  // display
  circle(x, y, dia);
}





