import codeanticode.syphon.*;

PGraphics pg;
SyphonServer server;

Population population;


void setup() {
  size(1920, 1200, P3D);
  pg = createGraphics(1920, 1200, P3D);
  
  // Create syhpon server to send frames out.
  server = new SyphonServer(this, "Processing Syphon");

  setupGUI();
  setupOSC();
  
 population = new Population();
}


void draw() {
  
  pg.smooth(4);
  pg.beginDraw();

  pg.clear();
  pg.background(0);
  pg.stroke(255);
  pg.strokeWeight(lineWeight);
  population.update();
  population.display();
  pg.endDraw();
  image(pg, 0, 0);
  
  server.sendImage(pg);
  drawGui();
}
