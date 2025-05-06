let sailor;
let backgrd;
let waveParticles = [];
let stormPars = [];
let islands = [];
//let NUM_WAVE_PARTICLES = 2000;
let MAX_OF_STORM_PARTICLES = 150

function setup() {
    let canvas = createCanvas(800, 500);
    canvas.parent("p5-canvas-container");

    // video = createCapture(VIDEO);
    // video.size(400, 400);

    angleMode(DEGREES);

    sailor = new Sailor(0, 260);
    backgrd = new Backgrd(20, 50);

    for (let i = 0; i < 800; i++) {
        let startX = random(0, width);
        let startY = 300 + random(-20, 20);
        waveParticles.push(new WaveParticle(startX, startY));
    }

    for (let i = 0; i < 200; i++) {
        let startX = random(-50, width);
        let startY = random(0, height);
        stormPars.push(new StormPar(startX, startY));
    }

    // islands.push(new Island(600, 400, "dream"));
}

function draw() {
    background(200, 225, 250);
    sailor.move();
    sailor.display();
    backgrd.move();
    backgrd.display();

    for (let i = 0; i < waveParticles.length; i++) {
        let p = waveParticles[i];
        p.update();
        p.display();

        if (p.x <= 0) {
            p.x = width + random(0, 10);
            p.y = 300 + random(-20, 20);
        }
    }

    for (let i = 0; i < stormPars.length; i++) {
        let s = stormPars[i];
        s.update();
        s.display();
    }

    if (stormPars.length > MAX_OF_STORM_PARTICLES) {
        stormPars.splice(0, 1);
    }

}

function drawFog() {
    //   loadPixels();
    //     let yN = frameCount * 0.01;
    //     for (let y = 0; y <= height; y += 2) {
    //       let xN = 0;
    //       for (let x = 0; x <= width; x += 2) {
    //         let bright = noise(xN, yN) * 255;
    //         //let fade = map(x,width,0,255,0)
    //         let alpha = map(bright, 100, 255, 0, 100);
    //         fill(255, 255, 255, alpha);
    //         rect(x, y, 2, 2);
    //         xN += 0.02;
    //       }
    //       yN += 0.02;
    //     }
}

class WaveParticle {
    constructor(x, y, dia) {
        this.x = x;
        this.y = y;
        this.xSpeed = 0.3;
        this.yFluc = random(100, 120);
    }

    update() {
        // if (keyIsDown(RIGHT_ARROW)) {
        //   this.xSpeed += 0.5;
        //   this.xSpeed = constrain(this.xSpeed,1,0.7)
        // }
        this.x -= this.xSpeed;

        this.y =
            300 +
            20 * sin(frameCount * 0.05) +
            noise(this.yFluc + frameCount * 0.01) * this.yFluc;
    }

    display() {
        push();
        translate(this.x, this.y);

        noStroke();
        fill(255, 120 + sin(this.x) * 50);
        circle(0, 0, 5);

        pop();
    }
}

class Sailor {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.xSpeed = 0.7
        this.fluc = random(100, 300)
    }


    move() {
        this.x += this.xSpeed;
        this.x = constrain(this.x, 100, width / 2 - 80)
        this.y = 260 + sin(frameCount * 2) * 10 + noise(this.fluc * 0.08) * 50;

    }

    display() {
        push();
        translate(this.x, this.y);
        for (let r = 60; r >= 20; r -= 5) {
            noStroke();
            fill(255, 255, 255, map(r, 60, 20, 10, 100));
            circle(0, 0, r);
        }

        fill(255, 255, 255);
        noStroke();
        circle(0, 0, 20);

        pop();
    }
}

class Backgrd {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    move() {
        this.x -= 1;
    }

    display() {
        push();
        translate(this.x, this.y);

        noStroke();
        fill(255);
        ellipse(0, 0, 20, 10);

        drawFog();

        pop();
    }
}

class StormPar {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    display() {
        push()
        translate(this.x, this.y)
        strokeWeight(1)
        stroke("rgba(0,180,255,0.66)")
        line(0, 0, 10, -20)
        pop()
    }

    update() {
        this.x -= 2
        this.y += 4

        if (this.y > height) {
            this.y = random(-5, 5);
            this.x = random(0, width + 80);
        }
    }
}

class Island {
    constructor(x, y, mode) {
        this.x = x;
        this.y = y;
        this.xSpeed = 1
        this.mode = mode;
    }

    update() {
        this.x += this.xSpeed
        if (x == width / 2) { this.xSpeed = 0 } else if (keyIsDown(RIGHT_ARROW)) { this.xSpeed = 1 }
    }

    display() {
        if (this.mode === "dream") {
            let skyTop = color("rgb(255,232,236)");
            let skyBottom = color("rgb(255,251,205)");
            drawIslandSky(skyTop, skyBottom);
        }

        else if (this.mode === "storm") {
            let skyTop = color("rgb(86,127,188)");
            let skyBottom = color("rgb(0,33,91)");
            drawIslandSky(skyTop, skyBottom);
        }

        else if (this.mode === "eureka") {
            let skyTop = color("rgb(255,232,236)");
            let skyBottom = color("rgb(255,251,205)");
            drawIslandSky(skyTop, skyBottom);
        }
    }
}

function drawIslandSky(c1, c2) {
    for (let y = 0; y < height; y++) {
        let inter = map(y, 0, height, 0, 1);
        let c = lerpColor(c1, c2, inter);
        stroke(c);
        line(0, y, width, y);
    }
}