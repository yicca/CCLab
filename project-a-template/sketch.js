let filtDia;
let r, g, b;
let orix, oriy;
let ultraR, ultraG, ultraB;
let angle;
let isOutOfControl = false;

function setup() {
    let canvas = createCanvas(800, 500);
    canvas.parent("p5-canvas-container");


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
}

function draw() {
    let bgAlpha = map(sin(frameCount * 1), -1, 1, -20, 20);
    bgAlpha = constrain(bgAlpha, 0, 20);
    background(40, bgAlpha);

    drawDaisy(width / 2, height / 2, r, g, b);
    image(e, 0, 0);

    drawCreature(mouseX, mouseY);

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
                amp = 30;
                rad = 50;
                petal = random(3, 5);
            }
        }
    }
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
    let dia = map(sin(frameCount * 5), -1, 1, 5, 15);

    if (mouseIsPressed) {
        speed = 0.15;

        //emotion bacteria
        let sinVal = sin(frameCount * 2);
        dia = map(sinVal, -1, 1, 10, 18);
        let filtAlp = map(sinVal, -1, 1, 80, 50);

        //change colors
        r += random(-20, 20);
        g += random(-20, 20);
        b += random(-20, 20);
        r = constrain(r, 40, 255);
        g = constrain(g, 40, 255);
        b = constrain(b, 40, 255);

        fill(r, g, b, filtAlp);

        // spread more circles
        for (let i = 0; i < 10; i++) {
            let angle = random(360);
            let rad = random(50);

            let x = orix + cos(angle) * rad;
            let y = oriy + sin(angle) * rad;

            let d = random(1, 2);

            circle(x, y, d);
        }
    } else {
        let a = map(sin(frameCount * 4), -1, 1, 120, 10);
        fill(150, a);
    }

    orix = lerp(orix, targetX, speed);
    oriy = lerp(oriy, targetY, speed);

    circle(orix, oriy, dia);

    pop();
}

let amp = 30;
let rad = 50;
let petal = 3;
let core = 0.3;

function drawDaisy(x, y, rD, gD, bD) {
    e.push();
    e.translate(x, y);

    let distance = dist(x, y, mouseX, mouseY);

    if (mouseIsPressed && distance < 150) {
        if (petal <= 8) {
            let radDistIn = rad + sin(angle * petal) * amp;
            let xD = cos(angle) * radDistIn;
            let yD = sin(angle) * radDistIn;
            e.stroke(rD, gD, bD);
            e.strokeWeight(2);
            e.line(xD * core, yD * core, xD, yD);

            angle += 0.5;
            if (angle >= 360) {
                rad += 8;
                amp += 10;
                petal += 1;
                core += 0.1;
                angle = 0;
            }
        } else {
            petal = 3;
        }
    }
    e.pop();
}

function restart() {
    e.clear();
    angle = 0;
    amp = 30;
    rad = 50;
    petal = 3;
    core = 0.3;
}

function keyPressed() {
    if (key == " ") {
        restart();
    }
}
