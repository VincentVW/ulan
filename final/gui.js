var gui;
var guiVisible = false;

var bController, cController, gController, dController, alphaController, dnaSpeedController;

function initGui() {
  // Create Layout GUI
  gui = new dat.gui.GUI({ name: "UB GUI" });
  gui.useLocalStorage = true;

  bController = gui.add(variables, "bucketSize", 25, 100, 1);
  cController = gui.add(variables, "c", 1500000, 2500000, 10000);
  gController = gui.add(variables, "gap", 13, 50, 1);
  dController = gui.add(variables, "drag", 0.5, 1.2, 0.01);
  
  alphaController = gui.add(variables, "minAlpha", 80, 255, 1);
  speedController = gui.add(variables, "speed", 0, 1.0, 0.01);
  dnaSpeedController = gui.add(variables, "dnaSpeed", 0, 1.0, 0.01);
  gui.remember(variables);

  bController.onFinishChange(reInit);
  cController.onFinishChange(reInit);
  gController.onFinishChange(reInit);
  dController.onFinishChange(reInit);

  gui.hide();
}

var reInit = function(value) {
  // Fires when a controller loses focus.
  // alert("The new value is " + value);
  logo = createGraphics(w, h);
  logo.background(51);
  img = createImage(1920, 1080);
  img.resize(width, 0);
  population = new Population();
  population.init();
};

// check for keyboard events
function keyPressed() {
  switch(key) {
    // type [F1] to hide / show the GUI
    case 'p':
        guiVisible = !guiVisible;
      if(guiVisible) gui.show(); else gui.hide();
      break;
  }
}