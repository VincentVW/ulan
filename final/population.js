
// POPULATION

function drawLine(p1, p2) {
    var d = distance(p1, p2);
    // if (d < pow(p1.maxdist, 1.5) && d > 1) {
      var alpha = map(d, 0, pow(p1.maxdist, 1.6), 255, variables.minAlpha);
      stroke(255, alpha);
      line(p1.x, p1.y, p2.x, p2.y);
    // }
  }
  
  function Population() {
    this.points = [];
  
    this.init = function() {
      this.maxdist = variables.gap * 8;
      drawImage(logo);
      logo.loadPixels();
      for (var x = 0; x < width + variables.bucketSize; x += variables.bucketSize) {
        for (var y = 0; y < height + variables.bucketSize; y += variables.bucketSize) {
          this.getParticles(x, y);
        }
      }
  
      this.createMesh();
    };
  
    this.createMesh = function() {
      this.mesh = new Delaunator(
        this.points,
        function(point) {
          return point.x;
        },
        function(point) {
          return point.y;
        }
      );
    };
  
    this.getParticles = function(x, y) {
      var g = variables.gap;
      // if(segmentColor[0] > 75)
      // g *= .5;
      g = floor(g);
      for (var i = 0; i < variables.bucketSize - g; i += g) {
        for (var j = 0; j < variables.bucketSize - g; j += g) {
          var home = createVector(x + i, y + j);
          var cell = new Cell(home.copy(), home, pow(g, 1.5));
          this.points.push(cell);
        }
      }
    };
  
    this.update = function() {
      for (var i = 0; i < this.points.length; i++) {
        this.points[i].update();
      }
    };
  
    this.display = function() {
      strokeWeight(1);
      noFill();
      for (var i = 0; i < this.points.length; i++) {
        variables.c = this.points[i];
        variables.c.display();
      }
      this.createMesh();
      var triangles = this.mesh.triangles;
  
      stroke(255);
      for (var i = 0; i < triangles.length; i += 3) {
        var k = triangles[i];
        var p = [
          this.points[triangles[i]],
          this.points[triangles[i + 1]],
          this.points[triangles[i + 2]]
        ];
  
        drawLine(p[0], p[1]);
        drawLine(p[1], p[2]);
        drawLine(p[2], p[0]);
      }
    };
  }
  
  // CELL
  
  function cubicPulse(c, w, x) {
    x = abs(x - c);
    if (x > w) return 0.0;
    x /= w;
    return 1.0 - x * x * (3.0 - 2.0 * x);
  }
  
  function Cell(pos, home, maxdist, vel, dna) {
    if (pos != null) this.pos = pos;
    else {
      this.pos = createVector();
      this.pos.x = random(width);
      this.pos.y = random(height);
    }
    if (home != null) this.home = home;
    else this.home = this.pos.copy();
    this.x = home.x;
    this.y = home.y;
    if (maxdist != null) this.maxdist = maxdist;
    if (vel != null) this.vel = vel;
    else this.vel = p5.Vector.random2D();
    this.connections = 0;
  
    if (dna != null) this.dna = dna;
    else this.dna = new DNA(null, 100);
  
    this.time = 0;
  
    this.addForce = function(force) {
      this.vel.add(force);
    };
  
    this.rotate = function(to, force) {
      var mag = to.mag();
      to.normalize();
      this.vel.add(p5.Vector.sub(to, this.dir).mult(mag * force));
    };
  
    // Should be enabled when tracking with ml5
    // this.mouseAcc = function() {
    //   var nose = {
    //     x: -1000,
    //     y: -1000
    //   };
    //   // console.log(poses);
    //   if (poses.length) {
    //     nose = poses.reduce((a, b) =>
    //       a.pose.nose.confidence > b.pose.nose.confidence ? a : b
    //     ).pose.nose;
    //     // nose.x = (width / 2) + ((nose.x - (width / 2)) * -1)
    //     // nose.x = width - nose.x;
    //   }
      
    //   // SUB 
    //   var dir = createVector(nose.x, nose.y).sub(this.pos);
    //   // console.log(nose);
    //   // console.log(dir);
    // // noStroke();
    // //   pointLight(color(255), createVector(sin(millis() / 1000) * 20, -40, -10));
    // //   scale(0.75);
    // //   sphere();
  
    //   var dist = dir.mag();
    //   var force = cubicPulse(0, variables.gap * 10, dist) * 12;
    //   // console.log(p5.Vector.random2D().setMag(force));
    //   return p5.Vector.random2D().setMag(force);
    // };
  
    // this.mouseAcc = function() {
  
    //   var nose = {
    //     x: -1000,
    //     y: -1000
    //   };
    //   // console.log(poses);
    //   if (poses.length) {
    //     nose = poses.reduce((a, b) =>
    //       a.pose.nose.confidence > b.pose.nose.confidence ? a : b
    //     ).pose.nose;
    //     // nose.x = (width / 2) + ((nose.x - (width / 2)) * -1)
    //     // nose.x = width - nose.x;
    //   }
    //   // var x = (nose.x + 1) / 2 * 1920;
    //   // var y = Math.abs((nose.y - 1) / 2) * 1080;
    //   // console.log(x);
    //   // console.log(y);
    //   var x = Math.abs(nose.x - 1920);
    //   // console.log(nose.x);
  
    //   // 1920 = links;
    //   // 0 = rechts; 
  
    //   var dir = createVector(x, nose.y).sub(this.pos);
    //   var dist = dir.mag();
    //   var force = cubicPulse(0, variables.gap*10, dist) * 12;
    //   return p5.Vector.random2D().setMag(force);
    // }
  
     this.mouseAcc = function() {
      var dir = createVector(mouseX, mouseY).sub(this.pos);
      var dist = dir.mag();
      var force = cubicPulse(0, variables.gap*10, dist) * 8;
      return p5.Vector.random2D().setMag(force);
    }
  
    this.update = function() {
      this.vel.mult(variables.drag);
      this.vel.add(this.mouseAcc());
      this.vel.add(
        this.home
          .copy()
          .sub(this.pos)
          .mult(0.005)
      );
      // the dna -> cosine creates the effect where it goes from triangled to squared
      this.vel.add(this.getDna()
      .mult(cos(frameCount/400)*variables.dnaSpeed+variables.dnaSpeedPlus)
      );
      this.pos.add(this.vel.copy().mult(variables.speed));
      this.time += 1;
      this.time %= this.dna.seq.length;
      this.x = this.pos.x;
      this.y = this.pos.y;
    };
  
    this.display = function() {
      stroke(255);
      point(this.pos.x, this.pos.y);
    };
  
    this.getDna = function() {
      return this.dna.get(0 + this.time);
    };
  
    this.getVelMagSq = function() {
      return this.vel.x * this.vel.x + this.vel.y * this.vel.y;
    };
  }
  
  // DNA
  function DNA(seq, length) {
    if (seq) {
      this.seq = seq;
    } else {
      this.seq = [];
      for (var i = 0; i < length; i++) {
        this.seq.push(p5.Vector.random2D().setMag(random(4)));
      }
    }
  
    this.get = function(i) {
      return this.seq[i].copy();
    };
  
    this.merge = function(partner) {
      var newSeq = [];
      for (var i = 0; i < this.seq.length; i++) {
        newSeq.push((this.seq[i] + partner.seq[i]) * 0.5);
      }
  
      return newSeq;
    };
  
    this.clone = function() {
      var temp = new DNA(this.seq, null);
      return temp;
    };
  }
  