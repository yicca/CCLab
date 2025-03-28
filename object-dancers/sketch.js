let dancer;

function setup() {
  // no adjustments in the setup function needed...
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  // ...except to adjust the dancer's name on the next line:
  dancer = new RebeccaDancer(width / 2, height / 2);
}

function draw() {
  // you don't need to make any adjustments inside the draw loop
  background(0);
  drawFloor(); // for reference only

  dancer.update();
  dancer.display();
}


class RebeccaDancer {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.mode = 1;
    this.sinValue = 0;

  }
  update() {
    // update properties here to achieve
    // your dancer's desired moves and behaviour

    if (frameCount % 240 < 120) {
      this.mode = 1;
    } else {
      this.mode = 2;
    }
  }
  display() {
    // the push and pop, along with the translate 
    // places your whole dancer object at this.x and this.y.
    // you may change its position on line 19 to see the effect.
    push();
    translate(this.x, this.y);

    // ******** //
    // ⬇️ draw your dancer from here ⬇️

    //tail

    push();
    translate(40, 10);

    let tailTurn = sin(frameCount * 0.03);
    rotate(tailTurn);

    stroke(210, 160, 0);
    strokeWeight(5);
    beginShape();
    curveVertex(0, 0);
    curveVertex(0, 0);
    curveVertex(5, -2);
    curveVertex(10, -6);
    curveVertex(10, -6);
    endShape();

    pop();

    //body

    for (let i = -60; i <= 40; i++) {
      if (this.mode === 1) {
        this.sinValue = sin(frameCount * 0.3 + i * 0.05) * 5;
      } else {
        this.mode = 2;
        this.sinValue = sin(frameCount * 0.2 * i) * 7;
      }
      let bodyH1 = 6 + this.sinValue;
      let bodyH2 = 40 + this.sinValue;

      stroke(210, 160, 0);
      strokeWeight(1);
      line(i, bodyH1, i, bodyH2);
    }

    //feet
    noStroke();

    fill(180, 120, 0);
    arc(-48, 40, 16, 20, -PI / 6, (PI * 7) / 6, CHORD);
    arc(32, 40, 16, 20, -PI / 6, (PI * 7) / 6, CHORD);

    fill(210, 160, 0);
    arc(-53, 40, 16, 20, -PI / 6, (PI * 7) / 6, CHORD);
    arc(27, 40, 16, 20, -PI / 6, (PI * 7) / 6, CHORD);

    //head

    fill(210, 160, 0);
    noStroke();

    beginShape();
    curveVertex(-60, -13);
    curveVertex(-70, -10);
    curveVertex(-80, 0);
    curveVertex(-87, 15);
    curveVertex(-80, 20);
    curveVertex(-70, 20);
    curveVertex(-42, 0);
    endShape(CLOSE);

    //ear

    fill(90, 40, 0);
    noStroke();

    beginShape();
    curveVertex(-54, 0);
    curveVertex(-54, 20);
    curveVertex(-37, 14);
    curveVertex(-41, -2);
    curveVertex(-44, -8);
    curveVertex(-52, -10);
    endShape(CLOSE);

    //nose

    circle(-86, 16, 5);

    //eyes

    if (this.mode === 1) {
      push()
      stroke(0);
      strokeWeight(3);
      line(-72, 3, -65, -1);
      pop()
    } else {
      this.mode = 2;
      noStroke()
      fill(255);
      circle(-69, 0, 15);
      fill(0);
      circle(-70, 0, 8);
    }
    // noFill();
    // stroke(255, 0, 0);
    // line(-5, 0, 5, 0);
    // line(0, -5, 0, 5);
    // stroke(255);
    // rect(-100, -100, 200, 200);
    // fill(255);
    // stroke(0);
  }
}
