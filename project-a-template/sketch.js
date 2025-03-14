let filtDia;
let r, g, b;
let orix, oriy;
let ultraR, ultraG, ultraB;
let monochrome = true;
let angle;
let isOutOfControl = false;
let expand = false;
let expandR;
let controlColor = false;
let beRed = false;
let beOrange = false;
let beYellow = false;
let beGreen = false;
let beCyan = false;
let beBlue = false;
let beViolet = false;
let bePink = false;

function setup() {
    //let canvas = createCanvas(800, 500);
    //canvas.parent("p5-canvas-container");

    createCanvas(800, 500);
    background(40);
    angleMode(DEGREES);

    orix = width / 2;
    oriy = height / 2;

    r = random(40, 240);
    g = random(40, 240);
    b = random(40, 240);

    angle = 0;
    expandR = 150;

    e = createGraphics(800, 500);
    e.background(0);
}

function draw() {
    //drawFlower(30, 30)
    if (mouseIsPressed) {
        monochrome = false;
    }

    if (!monochrome) {
        drawDaisy(width / 2, height / 2, r, g, b);
    }
    drawCreature(mouseX, mouseY);
    expandEnergy(width / 2, height / 2);

    if (
        mouseIsPressed &&
        (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height)
    ) {
        drawOutOfControl();
        isOutOfControl = true;
    } else {
        if (isOutOfControl == true) {
            background(40);
            isOutOfControl = false;
            drawDaisy(width / 2, height / 2, r, g, b);
            if (!isOutOfControl) {
                //amp = 1;
                //rad = 10;
                petal = random(4, 5);
                //core = 0.3;
            }
        }
    }
    e.clear();
    if (expand == true) {
        expandEnergy();
    }
    image(e, 0, 0);

    //console.log(round(frameRate()));
}

function mouseReleased() {
    //clear();
    //background(40);
    monochrome = true;
    angle += 0;
}

function drawOutOfControl() {
    push();

    //noise background
    let reso = 5;
    for (let y = 0; y < height; y += reso) {
        for (let x = 0; x < width; x += reso) {
            let freq1 = x * 0.02 + (frameCount % 255) * 0.1;
            let freq2 = y * 0.02 + (frameCount % 255) * 0.1;
            let noiseValue = noise(freq1, freq2);

            let ultraR = map(noiseValue, 0, 1, 255, 255);
            let ultraG = map(noiseValue, 0, 1, 230, 5);
            let ultraB = map(noiseValue, 0, 1, 240, 140);

            fill(ultraR, ultraG, ultraB);
            noStroke();
            rect(x, y, reso, reso);
        }
    }

    pop();
}

function drawCreature(targetX, targetY) {
    push();
    noStroke();

    let speed = 0.02;
    let dia = map(sin(frameCount * 5), -1, 1, 10, 13);
    let a = 255;

    if (mouseIsPressed == false) {
        a = map(sin(frameCount * 2), -1, 1, 80, 50);
        fill(150, a);
    } else {
        speed = 0.15;

        //emotion bacteria
        let sinVal = sin(frameCount * 2);
        dia = map(sinVal, -1, 1, 10, 18);
        let filtAlp = map(sinVal, -1, 1, 80, 50);

        if (keyIsPressed) {
            controlColor = true;
        } else {
            r += random(-20, 20);
            g += random(-20, 20);
            b += random(-20, 20);
            r = constrain(r, 40, 255);
            g = constrain(g, 40, 255);
            b = constrain(b, 40, 255);
        }

        fill(r, g, b, filtAlp);

        // spread more circles
        for (let i = 0; i < 10; i++) {
            let x = orix + random(-25, 25);
            let y = oriy + random(-25, 25);
            let d = random(1, 3);
            circle(x, y, d);
        }
    }

    orix = lerp(orix, targetX, speed);
    oriy = lerp(oriy, targetY, speed);

    circle(orix, oriy, dia);

    pop();
}

//let noi = 1;
let amp = 1;
let rad = 10;
let petal = 3;
let core = 0.3;

function drawDaisy(x, y, rD, gD, bD) {
    push();
    translate(x, y);
    if (mouseIsPressed) {
        if (petal <= 8) {
            let radDistIn = rad + sin(angle * petal) * amp;
            let xD = cos(angle) * radDistIn;
            let yD = sin(angle) * radDistIn;
            stroke(rD, gD, bD);
            strokeWeight(2);
            line(xD * core, yD * core, xD, yD);
            angle += 1;
            if (angle >= 360) {
                //noi += 5;
                rad += 8;
                rad = constrain(rad, 10, 70);
                amp += 10;
                amp = constrain(amp, 1, 80);
                petal += 1;
                angle = 0;
                core += 0.3;
                core = constrain(core, 0, 1);
                rotate(60);
            }
        } else {
            petal = 3;
            expand = true;
        }
    }
    pop();
}

function expandEnergy() {
    if (expand == true) {
        e.push();
        e.translate(width / 2, height / 2);
        for (let i = 0; i < 360; i += 30) {
            let xe = cos(i) * expandR;
            let ye = sin(i) * expandR;
            let a = map(expandR, 160, 230, 150, 0);
            e.fill(r + 50, g + 50, b + 50, a);
            e.noStroke();
            e.circle(xe, ye, 2);
            if (expandR == 230) {
                expandR = 160;
                break;
            }
        }
        expandR += 10;
        e.pop();
    }
}

function keyPressed() {
    if (controlColor == true) {
        if (key == "r") {
            //r = random(200, 255);
            //g = random(0, 80);
            //b = random(0, 50);
            beRed = true;
        } else if (key == "o") {
            beOrange = true;
        } else if (key == "y") {
            beYellow = true;
        } else if (key == "g") {
            BeGreen = true;
        } else if (key == "c") {
            beCyan = true;
        } else if (key == "b") {
            beBlue = true;
        } else if (key == "v") {
            beViolet = true;
        } else if (key == "p") {
            bePink = true;
        }
    }

    if (beRed) {
        //r += random(-20, 20);
        //g += random(-20, 20);
        //b += random(-20, 20);
        r = constrain(r, 200, 255);
        g = constrain(g, 0, 80);
        b = constrain(b, 0, 50);
    }
    if (beOrange) {
        r = constrain(r, 200, 255);
        g = constrain(g, 100, 255);
        b = constrain(b, 0, 50);
    }
    if (beYellow) {
        r = constrain(r, 200, 255);
        g = constrain(g, 200, 255);
        b = constrain(b, 0, 100);
    }
    if (beGreen) {
        r = constrain(r, 0, 150);
        g = constrain(g, 180, 255);
        b = constrain(b, 0, 150);
    }
    if (beCyan) {
        r = constrain(r, 0, 100);
        g = constrain(g, 180, 255);
        b = constrain(b, 180, 255);
    }
    if (beBlue) {
        r = constrain(r, 0, 100);
        g = constrain(g, 0, 150);
        b = constrain(b, 200, 255);
    }
    if (beViolet) {
        r = constrain(r, 150, 255);
        g = constrain(g, 0, 100);
        b = constrain(b, 150, 255);
    }
    if (bePink) {
        r = constrain(r, 200, 255);
        g = constrain(g, 100, 150);
        b = constrain(b, 150, 255);
    }
}
