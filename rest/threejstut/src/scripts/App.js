import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  LineBasicMaterial,
  Geometry,
  Vector3,
  BufferGeometry,
  BufferAttribute,
  Line

} from "three";

const scene = new Scene();

export default class App {
  constructor() {}

  init() {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(0, 0, 0);
    // this.camera.position.z = 5;

    this.renderer = new WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    
    // this.drawBox();
    // this.drawLine();
    this.updateThings();

    this.handlerAnimate = this.animate.bind(this);
    this.animate();
  }

  drawBox(){
    var geometry = new BoxGeometry( 1, 1, 1 );
    var material = new MeshBasicMaterial( { color: 0x00ff00 } );
    this.cube = new Mesh( geometry, material );
    this.scene.add(this.cube);
  }

  drawLine(){
    var material = new LineBasicMaterial({ color: 0x0000ff });

    var geometry = new Geometry();
    geometry.vertices.push(new Vector3( -10, 0, 0) );
    geometry.vertices.push(new Vector3( 0, 40, 0) );
    geometry.vertices.push(new Vector3( 10, 0, 0) );

    var line = new Line( geometry, material );
    this.scene.add( line );
  }

  updateThings() {
    var MAX_POINTS = 500;

    // geometry
    var geometry = new BufferGeometry();

    // attributes
    var positions = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point
    geometry.addAttribute( 'position', new BufferAttribute( positions, 3 ) );

    // draw range
    var drawCount = 2; // draw the first 2 points, only
    geometry.setDrawRange( 0, drawCount );

    // material
    var material = new LineBasicMaterial( { color: 0xff0000, linewidth: 2 } );

    // line
    var line = new Line( geometry,  material );
    scene.add( line );
  }

  animate() {
    requestAnimationFrame(this.handlerAnimate);
    // this.cube.rotation.x += 0.01;
    // this.cube.rotation.y += 0.015;
    this.renderer.render(this.scene, this.camera);
  }
}
