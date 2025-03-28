let sound;

function preload() {
  sound = loadSound("assets/beat.mp3")
}

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
}

function draw() {
  background(220);

  let volValue = map(mouseY, 0, height, 1, 0, true)
  sound.setVolume(volValue)

  let panValue = map(mouseX, 0, width, -1, 1, true)
  sound.setPan(panValue);

  let rateValue = map(mouseY, 0, height, 3, 0, 1, true)
  sound.setRate(rateValue)


}

function mousePressed() {

  if (sound.isPlaying()) {
    sound.pause()
  }
  else { sound.loop() }

  sound.play()
}