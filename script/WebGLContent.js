import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui';

import Camera from './Camera';
import Trails from './trails/Trails';

export default class WebGLContent {
  constructor(canvas) {
    this.canvas = canvas;
    this.time = 0;
    this.resolution = {
      x: window.innerWidth,
      y: window.innerHeight
    }

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    this.scene = new THREE.Scene();
    this.camera = new Camera({
      fov: 50,
      aspect: this.resolution.x / this.resolution.y,
      far: 1000,
      canvas,
      enableControl: false
      // enableDamping: true,
      // dampingFactor: 0.05
    });
    this.clock = new THREE.Clock(true);
    this.trails = null;

    this.stats = new Stats()
    this.gui = new GUI();

    this.init().then(this.start.bind(this));
  }

  resize(width, height) {
    this.resolution.x = width;
    this.resolution.y = height;
    this.renderer.setSize(this.resolution.x, this.resolution.y);
    this.camera.resize(this.resolution);
  }

  async init() {
    document.body.appendChild(this.stats.dom);
    // const max = 2000 * 30;
    // const num = Math.floor(Math.random() * 4000);
    // const length = Math.floor(max/num);
    const num = 4096/4;
    const length = 32 ;
    console.log(`trails => num: ${num}, length: ${length}`);
    this.trails = new Trails(this.renderer, num, length, {
      gui: this.gui
    });
    this.scene.add(this.trails);
    this.camera.init();
    this.setRenderer();
    this.bind();
  }

  start() {
    this.animate();
  }

  animate() {
    const deltaTime = this.clock.getDelta();
    this.time += deltaTime;
    this.camera.update(deltaTime);
    this.trails.update(deltaTime);
    this.renderer.render(this.scene, this.camera);
    this.stats.update();
    requestAnimationFrame(this.animate.bind(this));
  }

  setRenderer() {
    this.renderer.setSize(this.resolution.x, this.resolution.y);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.clearColor('#ffffff');
  }

  toggleDisplay() {
    this.stats.dom.classList.toggle('is-hidden');
    this.gui.domElement.classList.toggle('is-hidden');
  }

  handleKeyDown(e) {
    if(e.key === 'd') {
      this.toggleDisplay();
    }
  }

  bind() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this), { passive: true });
  }
}
