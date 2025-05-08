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
let waveInitialized = false;
let fogInitialized = false;
let fogArrive = false;
let landing = false;
let stormInitialized = false;
let islandParticlesInitialized = false;

let peaceful = false;
let dark = false;
let dreamy = false;
let surreal = false;

let video;
let bodyPose;
let poses = [];

function preload() {
    // load the bodyPose model
    //bodyPose = ml5.bodyPose();
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

    sailor = new Sailor(10, 260);
    driftBottle = new DriftBottle(width / 2 + 30, 330)

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
        this.yFluc = random(100, 120);
    }

    update() {
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
        // this.rad = rad;
        this.rotationAngle = 0;
        this.speed = 3; // character move speed
    }

    move() {
        this.x += this.xSpeed;
        this.x = constrain(this.x, 50, width / 2);
        this.y = 260 + sin(frameCount * 2) * 10 + noise(this.fluc * 0.08) * 50;
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

    changePosition(x, y) {
        this.x = x;
        this.y = y;
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
        strokeWeight(1);
        stroke("rgba(0,180,255,0.66)");
        line(0, 0, 10, -20);
        pop();
    }

    update() {
        this.x -= 2;
        this.y += 4;

        if (this.y > height) {
            this.y = random(-5, 5);
            this.x = random(0, width + 80);
        }
    }
}

class FogParticles {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.xSpeed = 1;
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
            this.b = 225;
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
        this.angle = 0
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
        this.rad = 60;
        this.r = 255;
        this.g = 255;
        this.b = 255;

        if (peaceful === true) {
            this.emoji = random(["🍃", "🐾", "🫧", "☁️", "🌈", "⭐️", "🥥", "🏝️"]);
        } else if (dreamy === true) {
            this.emoji = random(["🧸", "🎀", "💐", "🍀", "📜", "🪽", "🐚", "🕊️"]);
        } else if (dark === true) {
            this.emoji = random(["🌊", "💦", "🌫️", "🌧️", "🌪️", "⚡️", "💧", "💨"]);
        } else if (surreal === true) {
            this.emoji = random(["👁️", "👃🏻", "👂🏻", "🫀", "👄", "🖐🏻", "👣"])
            // draw the webcam video
            //image(video, 0, 0);
        }

        this.alphaParticle = map(this.rad, this.rad, 20, 30, 120);
    }
    checkMouse() {
        // this time, we return true or false,
        // so that we can use it in mousePressed() and mouseReleased()
        let worldMouseX = mouseX - worldOffsetX;
        let worldMouseY = mouseY - worldOffsetY;
        let distance = dist(this.x, this.y, worldMouseX, worldMouseY);
        if (distance < this.rad * 0.5) {
            this.alphaParticle = map(this.rad, this.rad, 20, 50, 200);

            if (draggingIslandParticle === this) {
                this.alphaParticle = 0;
                textSize(32);
                textAlign(CENTER, CENTER);
                fill(this.r, this.g, this.b);
                text(this.emoji, this.x, this.y);
            }
            return true; // Yes, mouse is inside!
        } else {
            this.alphaParticle = map(this.rad, this.rad, 20, 30, 120);
            return false; // No, mouse is outside!
        }
    }
    update() {
        if (draggingIslandParticle === this) {
            this.x = mouseX - worldOffsetX;
            this.y = mouseY - worldOffsetY;
        }
    }
    display() {
        if (peaceful === true) {
            this.r = 255;
            this.g = 255;
            this.b = 255;
        } else if (dreamy === true) {
            this.r = 243;
            this.g = 150;
            this.b = 155;
        } else if (dark === true) {
            this.r = 199;
            this.g = 199;
            this.b = 199;
        } else if (surreal === true) {
            this.r = 255;
            this.g = 255;
            this.b = 255;
        }

        push();
        translate(this.x, this.y);
        for (let r = this.rad; r >= 20; r -= 5) {
            noStroke();
            fill(this.r, this.g, this.b, this.alphaParticle);
            circle(0, 0, r);
        }
        pop();
    }
}

function drawIslandSky(c1, c2) {
    for (let y = 0; y < worldHeight; y++) {
        let inter = map(y, 0, worldHeight, 0, 1);
        let c = lerpColor(c1, c2, inter);
        stroke(c);
        line(0, y, worldWidth, y);
    }
}

function drawIsland() {
    // this will be the background of outside world.
    background(200, 225, 250);

    // move main character
    sailor.moveByKey();

    // we only calculate the position of the main character and
    // don't display the main character here.
    // we will display it after the world is drawn!

    // calculate the offset so that the main character stays at center
    worldOffsetX = width / 2 - sailor.x;
    worldOffsetY = height / 2 - sailor.y;

    push(); // world's push()
    translate(worldOffsetX, worldOffsetY);
    // noFill();
    // stroke(255, 0, 0);
    // rect(0, 0, worldWidth, worldHeight);

    // draw the world background
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
        isP.display();
    }

    // draw main character
    sailor.display();

    pop(); // world's pop()
}

function drawSailing() {
    //draw wave
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

    if (sailing) {
        background(200, 225, 250);

        push();
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

        if (dark) {
            drawStorming();
        }

        if (dreamy) {
            drawDriftBottle();
        }
    }
}

function drawStorming() {
    if (dark && !stormInitialized) {
        for (let i = 0; i < 200; i++) {
            let startX = random(-50, width);
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

        if (stormParticles.length > 150) {
            stormParticles.splice(0, 1);
        }
    }
}

function drawDriftBottle() {
    if (sailing == true && dreamy == true) {
        driftBottle.display();
        driftBottle.move();
    }
}

function mousePressed() {
    //go to landing
    let d = dist(mouseX, mouseY, width / 2 + 150, 230);
    if (sailing == true && fogArrive == true && d < 150) {
        sailor.changePosition(width / 2, height / 2);

        landing = true;
        sailing = false;

        fogArrive = false;
    }

    //go back to sailing
    if (landing) {
        let worldMouseX = mouseX - worldOffsetX;
        let worldMouseY = mouseY - worldOffsetY;

        if (
            worldMouseX < 0 ||
            worldMouseX > worldWidth ||
            worldMouseY < 0 ||
            worldMouseY > worldHeight
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

    //dragging island particles
    for (let i = islandParticles.length - 1; i >= 0; i--) {
        let isP = islandParticles[i];
        if (isP.checkMouse()) {
            // if true, this button is "draggingButton"!
            draggingIslandParticle = isP;
            break; // stop checking other buttons as we already found the one
        }
    }

    //see the drift bottle
    //if(sailing == true && dreamy == true){
    //   (width / 2 + 30, 330)
    // }
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
        peaceful = true;
    } else {
        peaceful = true;
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
