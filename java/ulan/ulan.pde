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
  pg.beginDraw();

  pg.clear();
  pg.smooth(4);
  pg.background(0);
  pg.stroke(255);
  pg.strokeWeight(1);
  population.update();
  population.display();
  pg.endDraw();
  image(pg, 0, 0);
  
  server.sendImage(pg);
  drawGui();
}
