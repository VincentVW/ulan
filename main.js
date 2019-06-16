var h =
  "innerHeight" in window
    ? window.innerHeight
    : document.documentElement.offsetHeight;

var w =
  "innerWidth" in window
    ? window.innerWidth
    : document.documentElement.offsetHeight;

var variables = {
  bucketSize: 50,
  c: 2000000,
  gap: 2000,
  drag: 0.86,
  minAlpha: 100,
  speed: 0.06,
  dnaSpeed: 0, //0.05,
  dnaSpeedPlus: 0 //0.5
}

var population;
var img;
var logo;

var distance = function(a, b) {
  return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
};

function setup() {
  createCanvas(w, h, "WEBGL");
  variables.gap = max(parseInt(variables.bucketSize / 2), 2);
  stroke(255);
  strokeWeight(2);
  logo = createGraphics(w, h);
  logo.background(51);
  img = createImage(1920, 1080);
  img.resize(width, 0);
  population = new Population();
  population.init();

  // initPosenet();
  initGui();
  initOsc();
}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  logo = createGraphics(width, height);
  drawImage(logo);
  logo.loadPixels();
  population = new Population();
  population.init();
}

function drawImage(c) {
  background(0, 255, 0);
  var scale = 0.77;
  var h = (img.height / img.width) * c.width * scale;
  c.image(
    img,
    width / 2 - c.width * scale * 0.5,
    c.height / 2 - (h / 2) * scale,
    c.width * scale,
    h
  );
}

function draw() {
  clear();
  population.update();
  population.display();
  strokeWeight(1);
}
