import java.util.List;
import java.util.Iterator; 
import java.lang.Math;

import megamu.mesh.*;

int bucketSize = 50;
int c = 2000000;
int gap = 25;
float drag = 0.86;
int minAlpha = 100;
float speed = 0.06;
float dnaSpeed = 0.005;
float dnaSpeedPlus = 0.2;
int width = 1920;
int height = 1200;
boolean drawLines = true;

double distance(float x1, float y1, float x2, float y2) {
  return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
};

void drawLine(float x1, float y1, float x2, float y2) {
  double d = distance(x1, y1, x2, y2);
  float alpha = map((float)d, 0, pow(pow(floor(gap), 1.5), 1.6), 255, minAlpha);
  pg.stroke(255, Math.round(alpha));
  pg.line(x1, y1, x2, y2);
}

  
class Population {
  
  List<Cell> points = new ArrayList<Cell>();
  float[][] edges;
  
  Population(){
      for (int x = 0; x < width + bucketSize; x += bucketSize) {
        for (int y = 0; y < height + bucketSize; y += bucketSize) {
          this.getParticles(x, y);
        }
      }
  
      this.createMesh();
  }
  
  public void update(){
    Iterator itr = this.points.iterator();
    while (itr.hasNext()) { 
        //  moving cursor to next element 
        Cell c = (Cell)itr.next();
        c.update();
    } 
  }
  
  public void display(){
    Iterator itr = this.points.iterator();
    while (itr.hasNext()) { 
        //  moving cursor to next element 
        Cell c = (Cell)itr.next();
        c.display();
    }
    
    this.createMesh();
    
    if(drawLines){
      float[][] edges = this.edges;
      for(int i=0; i<this.edges.length; i++){
        float startX = edges[i][0];
        float startY = edges[i][1];
        float endX = edges[i][2];
        float endY = edges[i][3];
        drawLine( startX, startY, endX, endY );
      }
    }
  }
  
  public void getParticles(int x, int y){
    int g = floor(gap);
    for (int i = 0; i < bucketSize - g; i += g) {
      for (int j = 0; j < bucketSize - g; j += g) {
        PVector home = new PVector(x + i, y + j);
        Cell cell = new Cell(home.copy(), home, pow(g, 1.5));
        this.points.add(cell);
      }
    }
  }
  
  public void createMesh(){
     
    Iterator itr = this.points.iterator();
    float[][] points = new float[1000][2];
  
    int pointIndex = 0;
    while (itr.hasNext()) { 
        //  moving cursor to next element 
        Cell c = (Cell)itr.next();
        points[pointIndex][0] = c.x;
        points[pointIndex][1] = c.y;
        pointIndex++;
    } 
    
    Delaunay myDelaunay = new Delaunay( points );
    this.edges = myDelaunay.getEdges();
  }
  
}



float cubicPulse(float c, float w, float x) {
  x = abs(x - c);
  if (x > w) return 0.0;
  x /= w;
  return 1.0 - x * x * (3.0 - 2.0 * x);
}



class Cell {
   PVector pos;
   PVector home;
   PVector vel;
   float x;
   float y;
   float maxdist;
   DNA dna;
   int time;
   
   
   Cell (PVector pos, PVector home, float maxdist){
     this.pos = pos;
     this.home = home;
     this.x = home.x;
     this.y = home.y;
     this.maxdist = maxdist;
     this.vel = PVector.random2D();
     //this.connections = 0;
     this.dna = new DNA();
     this.time = 0;
   }
   
   public void update(){
     
     this.vel.mult(drag);
     this.vel.add(this.mouseAcc());
      
     this.vel.add(
        this.home
          .copy()
          .sub(this.pos)
          .mult(0.005)
      );
      
      this.vel.add(this.getDna()
      .mult(cos(frameCount/400)*dnaSpeed+dnaSpeedPlus)
      );
      
      this.pos.add(this.vel.copy().mult(speed));  
      
      this.time += 1;
      this.time %= 100;
      this.x = this.pos.x;
      this.y = this.pos.y;
   }
  
   public void display(){
     pg.stroke(255);
     pg.point(this.pos.x, this.pos.y);
   }
   
   public PVector getDna() {
     return this.dna.get(0 + this.time);
   }
 
   private PVector mouseAcc() {
     // change to oscInputX, oscInputY when using OSC
    PVector dir = new PVector(oscInputX, oscInputY).sub(this.pos);
    float dist = dir.mag();
    float force = cubicPulse(0, gap*10, dist) * 8;
    return PVector.random2D().setMag(force);
  }
}


// DNA
class DNA {
  PVector[] seq;
  
  DNA() {
    PVector[] seq = new PVector[100];
    for (int i = 0; i < 100; i++) {
     seq[i] = PVector.random2D().setMag(random(4));
    }
    this.seq = seq;
  }

  public PVector get(int i) {
    return this.seq[i].copy();
  }
}
 
