let sound1;
let sound2;
let slider;
let currentSound = "flight";
let flightButton;
let heartButton;

function preload() {
  sound1 = loadSound('flight.mp3');
  sound2 = loadSound('music.mp3');
}

function setup() {
  let cnv = createCanvas(960, 700);
  cnv.mouseClicked(togglePlay);
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();

  sound1.amp(0.1);
  sound2.amp(0.1)
  sound = sound1;

  slider = createSlider(0, 1, 0.1, 0);
  slider.position(10,10);
  slider.style('width', '100px');

  textFont('Courier New');
  
  flightButton = createButton("Select 'Flight'");
  flightButton.position(10,40);
  flightButton.mousePressed(swapFlightSong);

  heartButton = createButton("Select 'Heart Afire'");
  heartButton.position(10,70);
  heartButton.mousePressed(swapHeartSong);
}

function draw() {
  background(248, 249, 250);
  rectMode(CENTER);
  translate(width / 2, height / 2);
  fill(0);
  text("volume", -1 * width / 2 + 120, -1 * height / 2 + 25);
  text("tap to play", -40, 0);
  sound1.amp(slider.value());
  sound2.amp(slider.value());
  rotate(5 * PI / 6);
  let spectrum = fft.analyze();
  let baseAmp = fft.getEnergy("bass");

  let newAmp = baseAmp;
  let beatAmount = (baseAmp > averageAmp) ? (baseAmp - averageAmp) * 4 : 0

  let chunks = 128;
  for (let i = 0; i < chunks; i++) {
    let col = color(`hsl(${Math.round(scaleAmplitude(spectrum[i*4])*360)}, 100%, 50%)`);
    fill(col);
    rect(0, 60 + scaleAmplitude(spectrum[i*4]) * 100 / 2, 5, 5 + scaleAmplitude(spectrum[i*4]) * 100);
    rotate(2 * PI / chunks);
  }

  noFill();
  beginShape();
  let radius = 160;
  for (let i = 0; i < chunks; i++) {
    radius = 160 + scaleAmplitude(baseAmp)*70 + scaleAmplitude(spectrum[i*4])*70;
    angle = 2 * PI * i / chunks;
    curveVertex(radius * Math.sin(-angle), radius * Math.cos(-angle));
  }
  endShape(CLOSE);
  
  averageAmpList.shift();
  averageAmpList.push(newAmp)
  averageAmp = averageAmpList.reduce((a,b) => a + b, 0) / averageAmpList.length
}


function togglePlay() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}

function swapFlightSong() {
  if (currentSound !== "flight") {
    if (sound.isPlaying()) {
      sound.pause();
    }
    sound = sound1;
    currentSound = "flight";
  }
}

function swapHeartSong() {
  if (currentSound !== "heart") {
    if (sound.isPlaying()) {
      sound.pause();
    }
    sound = sound2;
    currentSound = "heart";
  }
}

function scaleAmplitude(amp) {
  return 1/(1 + Math.exp(-10*(amp/255 - 0.5)));
}

let averageAmpList = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,]
let averageAmp = 0;