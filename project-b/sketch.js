let sailor;
let driftBottle;
let waveParticles = [];
let stormParticles = [];
let fogParticles = [];
let islandParticles = [];
let draggingIslandParticle = null;

let worldWidth = 1000;
let worldHeight = 1000;
let worldOffsetX = 0;
let worldOffsetY = 0;

let sailing = true;
let sailorInitialized = false;
let waveInitialized = false;
let fogInitialized = false;
let fogArrive = false;
let landing = false;
let stormInitialized = false;
let islandParticlesInitialized = false;
let showLetter = false;
let waitingToRestart = false;

let peaceful = false;
let dark = false;
let dreamy = false;
let surreal = false;

let ending = false;
let restart = false;

let video;
let bodyPose;
let poses = [];

function preload() {
    // load the bodyPose model
    //bodyPose = ml5.bodyPose();
    peacefulBackground = loadImage("assets/peaceful.png");
    dreamyBackground = loadImage("assets/dreamy.png");
    darkBackground = loadImage("assets/dark.png");
}

function setup() {
    let canvas = createCanvas(800, 500);
    canvas.parent("p5-canvas-container");

    // create the video and hide it
    // video = createCapture(VIDEO);
    // video.size(400, 400);
    // video.hide();

    // start detecting poses in the webcam video
    //bodyPose.detectStart(video, gotPoses);

    angleMode(DEGREES);
    textFont("Recoleta");

    // sailor = new Sailor(10, 240);
    driftBottle = new DriftBottle(100, 330)

    peaceful = true;
}

function draw() {
    drawSailing();
    drawStorming();

    if (landing) {
        drawIsland();
    }

}

class WaveParticles {
    constructor(x, y, dia) {
        this.x = x;
        this.y = y;
        this.xSpeed = 0.5;
        this.noiseOffset = random(1, 2);
        this.noiseAmp = 150;
        this.amp = 14;
    }

    update() {
        this.x -= this.xSpeed;

        if (peaceful) {
            this.amp = 8
        }
        else if (dark) {
            this.amp = 30
        }

        this.y =
            250 +
            this.amp * sin(this.x * 1.1 + frameCount * 0.02) +
            noise(this.x * 0.003 + frameCount * 0.01 + this.noiseOffset) * this.noiseAmp;
    }

    display() {
        push();
        translate(this.x, this.y);

        noStroke();
        fill(255, 120 + sin(this.x) * 50);
        circle(0, 0, 3);

        pop();
    }
}

class Sailor {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.xSpeed = 0.8;
        this.fluc = random(100, 300);
        this.x = x;
        this.y = y;
        this.rotationAngle = 0;
        this.speed = 3; // character move speed
    }

    move() {
        this.x += this.xSpeed;
        this.x = constrain(this.x, 50, width / 2);
        if (dark) {
            this.y = 240 + sin(frameCount * 2) * 30 + noise(this.fluc * 0.08) * 90;
        } else {
            this.y = 240 + sin(frameCount * 2) * 10 + noise(this.fluc * 0.08) * 50;
        }
    }

    moveByKey() {
        if (keyIsPressed) {
            // it won't detect capital letters.
            if (key == "w" || keyCode === UP_ARROW) {
                // up arrow or 'w'
                this.y -= this.speed;
                this.rotationAngle = radians(270);
            }
            if (key == "a" || keyCode === LEFT_ARROW) {
                // left arrow or 'a'
                this.x -= this.speed;
                this.rotationAngle = radians(180);
            }
            if (key == "s" || keyCode === DOWN_ARROW) {
                // down arrow or 's'
                this.y += this.speed;
                this.rotationAngle = radians(90);
            }

            if (key == "d" || keyCode === RIGHT_ARROW) {
                // right arrow or 'd'
                this.x += this.speed;
                this.rotationAngle = radians(0);
            }
        }

        // prevent going outside
        this.x = constrain(this.x, 0, worldWidth);
        this.y = constrain(this.y, 0, worldHeight);
    }

    display() {
        push();
        translate(this.x, this.y);
        for (let r = 60; r >= 20; r -= 2) {
            noStroke();
            fill(255, 255, 255, map(r, 60, 20, 10, 100));
            circle(0, 0, r);
        }
        pop();
    }

    changePosition(x, y) {
        this.x = x;
        this.y = y;
    }

    //go back to sailing
    backToSailing() {
        if (landing) {
            if (
                this.x <= 0 ||
                this.x >= worldWidth ||
                this.y <= 0 ||
                this.y >= worldHeight
            ) {
                landing = false;
                sailing = true;

                switchMode();

                //reset wave
                waveParticles = [];
                waveInitialized = false;

                //reset fog
                fogParticles = [];
                fogInitialized = false;
                fogArrive = false;

                //reset sailor
                sailor.x = 10;
                sailor.y = 260;

                //reset island particles
                islandParticles = [];
                islandParticlesInitialized = false;
            }
        }
    }
}

class StormParticles {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    display() {
        push();
        translate(this.x, this.y);
        strokeWeight(0.8);
        stroke("rgba(0, 179, 255, 0.47)");
        line(0, 0, 10, -20);
        pop();
    }

    update() {
        this.x -= 4;
        this.y += 8;

        if (this.y > height) {
            this.y = random(-5, 5);
            this.x = random(0, width * 2);
        }
    }
}

class FogParticles {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.xSpeed = 1.2;
        this.r = 255;
        this.g = 255;
        this.b = 255;

        this.rad = random(50, 100);
        this.angle = random(360);
        this.offsetX = cos(this.angle) * random(0, 100);
        this.offsetY = sin(this.angle) * random(0, 100);
        this.alpha = map(this.rad, 0, 100, 80, 20);
        this.alpha = constrain(this.alpha, 0, 255);
    }

    display() {
        if (peaceful === true) {
            this.r = 255;
            this.g = 255;
            this.b = 255;
        } else if (dreamy === true) {
            this.r = 255;
            this.g = 232;
            this.b = 236;
        } else if (dark === true) {
            this.r = 40;
            this.g = 80;
            this.b = 150;
        } else if (surreal === true) {
            this.r = 255;
            this.g = 255;
            this.b = 255;
        }

        noStroke();
        fill(this.r, this.g, this.b, this.alpha);
        ellipse(this.x + this.offsetX, this.y + this.offsetY, this.rad);
    }

    move() {
        this.x -= this.xSpeed;
        this.x = constrain(this.x, width / 2 + 150, width + 200);
        if (this.x <= width / 2 + 200) {
            fogArrive = true;
        }
    }
}

class DriftBottle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        //this.angle = 0
    }

    display() {
        push();
        translate(this.x, this.y);
        rotate(-20);
        scale(0.5);

        fill(180, 230, 250, 180);
        beginShape();
        vertex(-20, -40);
        bezierVertex(-30, -10, -30, 30, -15, 40);
        bezierVertex(-10, 45, 10, 45, 15, 40);
        bezierVertex(30, 30, 30, -10, 20, -40);
        endShape(CLOSE);

        fill(150, 200, 255);
        rect(-10, -50, 20, 10, 5);

        fill(120, 80, 50);
        rect(-8, -60, 16, 10, 3);

        pop();
    }

    move() {
        this.y = 330 + sin(frameCount * 2) * 5
    }
}

class IslandParticles {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.rad = 15;
        this.r = 255;
        this.g = 255;
        this.b = 255;
        this.xV = random(-0.2, 0.2);
        this.yV = random(-0.2, 0.2);

        if (peaceful === true) {
            this.emoji = random(["A sip of sunlit coconut sweetness", "The soft sand beneath my feet ", "Sunlight", "Palm trees in the breeze", "Afterglow", "Starry Night", "Clear Blue Sea", ""]);
        } else if (dreamy === true) {
            this.emoji = random(["The teddy bear on my bed", "The gift I received on my 6-year-old birthday", "My friends", "What will my future be like?", "A pure and carefree happiness", "I still remember that day...", "I missed my home."]);
        } else if (dark === true) {
            this.emoji = random(["The roaring waves", "My soaking wet hair and drenched clothes", "I don't wanna die...", "The howling wind", "A black, churning sky", "I'm so scared.", "Did the darkness swallow my soul?"]);
        } else if (surreal === true) {
            this.emoji = random(["👁️", "👃🏻", "👂🏻", "🫀", "👄", "🖐🏻", "👣"])
            // draw the webcam video
            //image(video, 0, 0);
        }

        this.alphaParticle = map(this.rad, this.rad, this.rad * 0.3, 30, 120);
    }

    checkMouse() {
        let worldMouseX = mouseX - worldOffsetX;
        let worldMouseY = mouseY - worldOffsetY;
        let distance = dist(this.x, this.y, worldMouseX, worldMouseY);
        if (distance < this.rad * 0.5) {
            this.alphaParticle = map(this.rad, this.rad, this.rad * 0.3, 60, 200);

            if (draggingIslandParticle === this) {
                this.alphaParticle = 0;
                textSize(14);
                textAlign(CENTER);
                fill(this.r, this.g, this.b);
                text(this.emoji, this.x, this.y);
            }
            return true;
        } else {
            this.alphaParticle = map(this.rad, this.rad, this.rad * 0.3, 30, 120);
            return false;
        }
    }
    update() {
        if (draggingIslandParticle === this) {
            this.x = mouseX - worldOffsetX;
            this.y = mouseY - worldOffsetY;
        }
    }

    scale() {
        if (this.rad <= 40) {
            this.rad = this.rad * 1.01;
        }
    }

    move() {
        this.x += this.xV;
        this.y += this.yV;
    }

    display() {
        if (peaceful === true) {
            this.r = 222;
            this.g = 255;
            this.b = 215;
        } else if (dreamy === true) {
            this.r = 255;
            this.g = 232;
            this.b = 236;
        } else if (dark === true) {
            this.r = 210;
            this.g = 210;
            this.b = 210;
        } else if (surreal === true) {
            this.r = 255;
            this.g = 255;
            this.b = 255;
        }

        push();
        translate(this.x, this.y);
        rotate(frameCount * 0.01);
        for (let r = this.rad; r >= 20; r -= 2) {
            noStroke();
            fill(this.r, this.g, this.b, this.alphaParticle);
            circle(0, 0, r);
        }
        pop();
    }
}

function drawIslandSky(c1, c2) {
    let bg = color(200, 225, 250);

    for (let y = 101; y < worldHeight - 100; y++) {
        let inter = map(y, 101, worldHeight - 101, 0, 1);
        let c = lerpColor(c1, c2, inter);
        stroke(c);
        line(0, y, worldWidth, y);
    }

    for (let i = 0; i <= 100; i++) {
        let inter = map(i, 0, 100, 0, 1);
        let c = lerpColor(bg, c1, inter);
        stroke(c);
        line(0, i, worldWidth, i);
    }

    for (let i = 100; i >= 0; i--) {
        let inter = map(i, 100, 0, 0, 1);
        let c = lerpColor(c2, bg, inter);
        stroke(c);
        line(0, worldHeight - i, worldWidth, worldHeight - i);
    }
}

function drawIsland() {
    background(200, 225, 250);

    sailor.moveByKey();
    worldOffsetX = width / 2 - sailor.x;
    worldOffsetY = height / 2 - sailor.y;

    push(); // world's push()
    translate(worldOffsetX, worldOffsetY);

    if (peaceful === true) {
        let c1 = color("rgb(196,205,255)");
        let c2 = color("rgb(222,255,215)");
        drawIslandSky(c1, c2);
    } else if (dreamy === true) {
        let c1 = color("rgb(255,232,236)");
        let c2 = color("rgb(255,251,205)");
        drawIslandSky(c1, c2);
    } else if (dark === true) {
        let c1 = color("rgb(86,127,188)");
        let c2 = color("rgb(0,33,91)");
        drawIslandSky(c1, c2);
    } else if (surreal === true) {
        let c1 = color("rgb(243,243,243)");
        let c2 = color("rgb(97,97,97)");
        drawIslandSky(c1, c2);
    }

    //draw island particles
    if (landing && !islandParticlesInitialized) {
        for (let i = 0; i < 50; i++) {
            islandParticles.push(
                new IslandParticles(random(worldWidth), random(worldHeight))
            );
        }
        islandParticlesInitialized = true;
    }

    for (let i = 0; i < islandParticles.length; i++) {
        let isP = islandParticles[i];
        isP.checkMouse();
        isP.update();
        isP.scale();
        isP.move();
        isP.display();
    }

    if (islandParticles.length > 50) {
        stormParticles.splice(0, 1);
    }

    // draw main character
    sailor.display();
    sailor.backToSailing();

    pop(); // world's pop()
}

function drawSailing() {
    //draw wave
    if (sailing && !sailorInitialized) {
        sailor = new Sailor(10, 240);
    }
    sailorInitialized = true;


    if (sailing && !waveInitialized) {
        for (let i = 0; i < 900; i++) {
            let startX = random(-50, width);
            let startY = random(300, 400);
            waveParticles.push(new WaveParticles(startX, startY));
        }
        waveInitialized = true;
    }

    if (sailing && !fogInitialized) {
        for (let i = 0; i < 100; i++) {
            let startX = width + 400;
            let startY = 230;
            fogParticles.push(new FogParticles(startX, startY));
        }
        fogInitialized = true;
    }

    if (sailing && !waitingToRestart) {
        background(200, 225, 250);

        push();
        translate(0, 0);
        for (let y = 290; y <= height; y++) {
            let alphaSea = map(y, 290, height, 0, 255);
            strokeWeight(1);
            stroke(136, 162, 203, alphaSea);
            line(0, y, width, y);
        }
        pop();

        sailor.move();
        sailor.display();

        for (let i = 0; i < waveParticles.length; i++) {
            let w = waveParticles[i];
            w.update();
            w.display();

            //wave particles reappear
            if (w.x <= 0) {
                w.x = width + random(0, 10);
                w.y = 300 + random(-20, 20);
            }
        }

        for (let i = 0; i < fogParticles.length; i++) {
            let f = fogParticles[i];
            f.move();
            f.display();
        }

        if (peaceful && fogArrive == true) {
            noStroke();
            fill(80);
            textSize(18);
            textAlign(LEFT);
            text("It seems you've arrived at a mysterious island.", 60, 100);
            text("Click on the fog land and explore!", 60, 130);
        }

        if (dreamy) {
            drawDriftBottle();
            noStroke();
            fill(80);
            textSize(18);
            textAlign(LEFT);
            text("Here's a drift bottle.", 60, 100);
            text("Click to see what's inside.", 60, 130);
        }

        if (dark) {
            drawStorming();
            noStroke();
            fill(80);
            textSize(18);
            textAlign(LEFT);
            text("You encountered a storm.", 60, 100);
            text("You almost lost your life in this storm...", 60, 130);
        }

        if (ending) {
            drawEnding();
            fogArrive = false;
            waitingToRestart = true;
            sailing = false;
        }
    }
}

function drawStorming() {
    if (dark && !stormInitialized) {
        for (let i = 0; i < 600; i++) {
            let startX = random(-50, width * 2);
            let startY = random(0, height);
            stormParticles.push(new StormParticles(startX, startY));
        }
        stormInitialized = true;
    }

    if (dark) {
        for (let i = 0; i < stormParticles.length; i++) {
            let s = stormParticles[i];
            s.update();
            s.display();
        }

        if (stormParticles.length > 600) {
            stormParticles.splice(0, 1);
        }
    }
}

function drawDriftBottle() {
    if (sailing == true && dreamy == true) {
        driftBottle.display();
        driftBottle.move();
        if (showLetter) {
            noStroke();
            fill("rgb(255, 230, 147)")
            rectMode(CENTER);
            rect(width / 2, height / 2, 300, 220, 20)

            push();
            textSize(38);
            textFont("Duck & Tiger");
            textAlign(CENTER);
            fill(20);
            text("Something from the past...", width / 2, height / 2);

            textSize(14);
            textFont("Recoleta");
            fill(80);
            textAlign(CENTER);
            text("Click on the drift bottle to put it back.", width / 2, height / 2 + 90);
            pop();
        }
    }
}

function mousePressed() {
    //dragging island particles
    for (let i = islandParticles.length - 1; i >= 0; i--) {
        let isP = islandParticles[i];
        if (isP.checkMouse()) {
            // if true, this button is "draggingButton"!
            draggingIslandParticle = isP;
            break; // stop checking other buttons as we already found the one
        }
    }

    //go to landing
    let d = dist(mouseX, mouseY, width / 2 + 150, 230);
    if (sailing == true && showLetter == false && d < 200) {
        sailor.changePosition(width / 2, height / 2);

        landing = true;
        sailing = false;

        fogArrive = false;
    }

    //see the drift bottle
    let dMB = dist(mouseX, mouseY, 100, 330);
    if (sailing == true && dreamy == true && dMB <= 50) {
        showLetter = !showLetter;
    }

    if (ending) {
        sailing = true;
        landing = false;

        peaceful = true;
        dreamy = false;
        dark = false;
        surreal = false;
        ending = false;
    }

    if (waitingToRestart) {
        waitingToRestart = false;
        ending = false;
        sailing = true;

        sailorInitialized = false;
        waveInitialized = false;
        fogInitialized = false;
        fogArrive = false;
        stormInitialized = false;
    }
}

function mouseReleased() {
    draggingIslandParticle = null; // reset dragging button
}

function switchMode() {
    if (peaceful) {
        peaceful = false;
        dreamy = true;
    } else if (dreamy) {
        dreamy = false;
        dark = true;
    } else if (dark) {
        dark = false;
        surreal = true;
    } else if (surreal) {
        surreal = false;
        ending = true;
    }
}

function drawEnding() {
    background(150, 150, 150, 255);

    if (ending) {
        textAlign(CENTER);
        textSize(18);
        noStroke();
        fill(255);
        text("Time always streams forward.", width / 2, height / 2 - 40);
        text("So do your memories.", width / 2, height / 2);
        text("So do you.", width / 2, height / 2 + 40);

        let alphaText = sin(frameCount * 3) * 80 + 120
        fill(255, 255, 255, alphaText)
        textSize(12);
        text("Click to restart", width / 2, height - 50)
    }
}

// function drawVideo() {
//     // draw the webcam video
//     image(video, 0, 0);

//     // draw all the tracked landmark points
//     for (let i = 0; i < poses.length; i++) {
//         let pose = poses[i];
//         for (let j = 0; j < pose.keypoints.length; j++) {
//             let keypoint = pose.keypoints[j];
//             // only draw if confidence is high enough
//             if (keypoint.score > 0.1) {
//                 fill(0, 255, 0);
//                 noStroke();
//                 circle(keypoint.x, keypoint.y, 5);

//                 // display bodypart name and score
//                 text(keypoint.name, keypoint.x + 10, keypoint.y);
//                 text(keypoint.score.toFixed(2), keypoint.x + 10, keypoint.y + 20);
//             }
//         }
//     }
// }

// // callback function for when bodyPose outputs data
// function gotPoses(results) {
//     // save the output to the poses variable
//     poses = results;
// }