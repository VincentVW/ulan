// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let video;
let poseNet;
let poses = [];

// function setup() {
//   createCanvas(640, 480);
//   video = createCapture(VIDEO);
//   video.size(width, height);

//   // Create a new poseNet method with a single detection
//   poseNet = ml5.poseNet(video, modelReady);
//   // This sets up an event that fills the global variable "poses"
//   // with an array every time new poses are detected
//   poseNet.on('pose', function(results) {
//     poses = results;
//   });
//   // Hide the video element, and just show the canvas
//   video.hide();
// }

// function modelReady() {
//   select('#status').html('Model Loaded');
// }

// function draw() {
//   image(video, 0, 0, width, height);

//   // We can call both functions to draw all keypoints and the skeletons
//   drawKeypoints();
//   drawSkeleton();
// }

// // A function to draw ellipses over the detected keypoints
// function drawKeypoints()  {
//   // Loop through all the poses detected
//   for (let i = 0; i < poses.length; i++) {
//     // For each pose detected, loop through all the keypoints
//     let pose = poses[i].pose;
//     for (let j = 0; j < pose.keypoints.length; j++) {
//       // A keypoint is an object describing a body part (like rightArm or leftShoulder)
//       let keypoint = pose.keypoints[j];
//       // Only draw an ellipse is the pose probability is bigger than 0.2
//       if (keypoint.score > 0.2) {
//         fill(255, 0, 0);
//         noStroke();
//         ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
//       }
//     }
//   }
// }

// // A function to draw the skeletons
// function drawSkeleton() {
//   // Loop through all the skeletons detected
//   for (let i = 0; i < poses.length; i++) {
//     let skeleton = poses[i].skeleton;
//     // For every skeleton, loop through all body connections
//     for (let j = 0; j < skeleton.length; j++) {
//       let partA = skeleton[j][0];
//       let partB = skeleton[j][1];
//       stroke(255, 0, 0);
//       line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
//     }
//   }
// }









var h = "innerHeight" in window
               ? window.innerHeight
               : document.documentElement.offsetHeight;

var w = "innerWidth" in window
               ? window.innerWidth
               : document.documentElement.offsetHeight;
var bucketSize = 10;
var c = 2000000;
var population;
var gap = 2;
var drag = .86;
var speed = 1.*((w*h)/c);

var img;
var logo;

var distance = function(a, b){
  return Math.pow(a.x - b.x, 2) +  Math.pow(a.y - b.y, 2);
}

function preload() {
  img = loadImage("https://cdn.rawgit.com/worosom/sane/a21b0476/static/index/img/sane_logo_wl_1920_coded_rgb.png");
}

function setup() {
  createCanvas(w, h, "WEBGL");
  bucketSize= 25;
  gap = max(parseInt(bucketSize/2), 2);
  stroke(255);
  strokeWeight(2.);
  logo = createGraphics(w, h);
  img.resize(width, 0);
  population = new Population();
  population.init();
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
  var scale = .77;
  var h = img.height / img.width * c.width*scale;
  c.image(img, width / 2 -c.width*scale*.5, c.height/2-(h)/2*scale, c.width*scale, h);
}

function draw() {
  clear();
  population.update();
  //image(logo, 0, 0);
  population.display();
  strokeWeight(1);
  //console.log(getColor(logo, [mouseX, mouseY], 5, 1));
}

function getColor(image, pos, area, step) {
  var result = [0, 0, 0, 0];
  if(pos[0] < image.width && pos[1]+area < image.height) {
    for(var x = 0; x < area; x += step) {
      for(var y = 0; y < area; y += step) {
        var d = pixelDensity();
        for(var i = 0; i < d; i++) {
          for(var j = 0; j < d; j++) {
            var posy = pos[0]+x;
            var posx = pos[1]+y;
            var id = 4*((posx*d+j)*image.width*d+(posy*d+i));
            id = parseInt(id);
            result[0] += image.pixels[id];
            result[1] += image.pixels[id+1];
            result[2] += image.pixels[id+2];
            result[3] += image.pixels[id+3];
          }
        }
        for(var k = 0; k < 4; k++)
          result[k] /= d;
      }
    }
    for(var k = 0; k < 4; k++)
      result[k] = parseInt(result[k]*pow(step/area,2));
  }
  
  return result;
}

function Population() {
  this.points = [];
  this.init = function() {
    this.maxdist = gap*8;
    drawImage(logo);
    logo.loadPixels();
    for(var x = 0; x < width+bucketSize; x += bucketSize) {
      for(var y = 0; y < height+bucketSize; y += bucketSize) {
        this.getParticles(x, y);
      }
    }
    this.createMesh();
  }
  
  this.createMesh = function() {
    this.mesh = new Delaunator(this.points, (point) => {return point.x}, (point) => {return point.y});
  }

  this.getParticles = function(x, y) {
    var g = gap;
    var segmentColor = getColor(logo, [x, y], bucketSize, gap);
    if(segmentColor[0] > 75)
      g *= .5;
    g = floor(g);
    for(var i = 0; i < bucketSize-g; i+= g) {
      for(var j = 0; j < bucketSize-g; j += g) {
        var pixel = getColor(logo, [x+i-parseInt(g/2), y+j-parseInt(g/2)], g, 1);
        if(pixel[1] > 2) {
          var pos = createVector(random(width), random(height));
          var home = createVector(x+i, y+j);
          var ran = p5.Vector.random2D().setMag(random(g/4));
          var cell = new Cell(home.copy(), home, pow(g, 1.5));
          this.points.push(cell);
        }
      }
    }
  }

  this.update = function() {
    for(var i = 0; i < this.points.length; i++) {
      this.points[i].update();
    }
  }

  this.display = function() {
    strokeWeight(1);
    noFill();
//    for(var i = 0; i < this.points.length; i++) {
//      c = this.points[i];
      //c.display();
//    } 
    this.createMesh();
    var triangles = this.mesh.triangles;

    stroke(255);
    for (var i = 0; i < triangles.length; i += 3) {
      var k = triangles[i];
      var p = [
        this.points[triangles[i]],
        this.points[triangles[i+1]],
        this.points[triangles[i+2]],
      ];
      
      drawLine(p[0], p[1]);
      drawLine(p[1], p[2]);
      drawLine(p[2], p[0]);
    }
  }
}//

function drawLine(p1, p2) {
  var d = distance(p1, p2);
  if(d < pow(p1.maxdist, 1.5) && d > 1) {
    var alpha = map(d, 0, pow(p1.maxdist, 1.5), 255, 0);
    stroke(255, alpha);
    line(p1.x, p1.y, p2.x, p2.y);
  }
}

function cubicPulse(c, w, x) {
  x = abs(x-c);
  if( x > w ) return 0.0;
  x /= w;
  return 1.0 - x*x*(3.0-2.0*x);
}

function Cell(pos, home, maxdist, vel, dna) {
  if(pos != null)
    this.pos = pos;
  else {
    this.pos = createVector();
    this.pos.x = random(width);
    this.pos.y = random(height);
  }
  if(home != null)
    this.home = home;
  else
    this.home = this.pos.copy();
  this.x = home.x;
  this.y = home.y;
  if(maxdist != null)
    this.maxdist = maxdist;
  if(vel != null)
    this.vel = vel;
  else
    this.vel = p5.Vector.random2D();
  this.connections = 0;

  if(dna != null)
    this.dna = dna;
  else
    this.dna = new DNA(null, 100);

  this.time = 0;

  this.addForce = function(force) {
    this.vel.add(force);
  }

  this.rotate = function(to, force) {
    var mag = to.mag();
    to.normalize();
    this.vel.add(p5.Vector.sub(to, this.dir).mult(mag * force));
  }

  this.mouseAcc = function() {
    var dir = createVector(mouseX, mouseY).sub(this.pos);
    var dist = dir.mag();
    var force = cubicPulse(0, gap*10, dist) * 8;
    return p5.Vector.random2D().setMag(force);
  }

  this.update = function() {
    this.vel.mult(drag);
    this.vel.add(this.mouseAcc());
    this.vel.add(this.home.copy().sub(this.pos).mult(.005));
    this.vel.add(this.getDna().mult(cos(frameCount/400)*.5+.5));
    this.pos.add(this.vel.copy().mult(speed));
    this.time += 1;
    this.time %= this.dna.seq.length;
    this.x = this.pos.x;
    this.y = this.pos.y;
  }

  this.display = function() {
    stroke(255);
    point(this.pos.x, this.pos.y);
  }

  this.getDna = function() {
    return this.dna.get(0+(this.time));
  }

  this.getVelMagSq = function() {
    return this.vel.x * this.vel.x + this.vel.y * this.vel.y;
  }
}

function DNA(seq, length) {
  if(seq) {
    this.seq = seq;
  } else {
    this.seq = [];
    for(var i = 0; i < length; i++) {
      this.seq.push(p5.Vector.random2D().setMag(random(4)));
    }
  }

  this.get = function(i) {
    return this.seq[i].copy();
  }

  this.merge = function(partner) {
    var newSeq = [];
    for(var i = 0; i < this.seq.length; i++) {
      newSeq.push((this.seq[i]+partner.seq[i])*.5);
    }

    return newSeq;
  }

  this.clone = function() {
    var temp = new DNA(this.seq, null);
    return temp;
  }
}