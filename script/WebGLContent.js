import * as THREE from 'three';
import textureImage from '../texture.png';
import Camera from './Camera';
import Cylinder  from './cylinder/Cylinder';

export default class WebGLContent {
  constructor(canvas) {
    this.canvas = canvas;
    this.time = 0;
    this.resolution = {
      x: window.innerWidth,
      y: window.innerHeight
    }
    this.texture = null;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });
    this.scene = new THREE.Scene();
    this.camera = new Camera({
      fov: 50,
      aspect: this.resolution.x / this.resolution.y,
      far: 1000,
      canvas,
      enableDamping: true,
      dampingFactor: 0.05
    });
    this.clock = new THREE.Clock(true);
    this.cylinder = null;

    this.init().then(this.start.bind(this));
  }

  resize(width, height) {
    this.resolution.x = width;
    this.resolution.y = height;
    this.renderer.setSize(this.resolution.x, this.resolution.y);
    this.camera.resize(this.resolution);
  }

  async init() {
    const loader = new THREE.TextureLoader();
    const texture = await loader.loadAsync(textureImage);
    this.cylinder = new Cylinder(texture);
    this.scene.add(this.cylinder);
    this.camera.init();
    this.setRenderer();
  }

  start() {
    this.animate();
  }

  animate() {
    const deltaTime = this.clock.getDelta();
    this.time += deltaTime;
    this.camera.update(deltaTime);
    this.cylinder.update(deltaTime);
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate.bind(this));
  }

  setRenderer() {
    this.renderer.setSize(this.resolution.x, this.resolution.y);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.clearColor('#ffffff');
  }
}
