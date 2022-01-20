import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class Camera extends THREE.PerspectiveCamera {
  constructor(options = {}) {
    super(options?.fov, options?.aspect, options?.near, options?.far);
    this.time = 0;
    this.enableControl = true;

    if (!options?.canvas) return;
    if (!this.enableControl) return;
    this.controls = new OrbitControls(this, options?.canvas);
    this.controls.enableDamping = options?.enableDamping || false;
    this.controls.dampingFactor = options?.dampingFactor ?? 0.2;
  }

  init() {
    this.position.set(-10, 5, 5);
    this.lookAt(new THREE.Vector3(0, 0, 0));
  }

  resize(resolution) {
    this.aspect = resolution.x / resolution.y;
    this.updateProjectionMatrix();
  }

  update(deltaTime) {
    const r = 14;
    this.time += deltaTime;
    this.position.set( Math.sin( this.time * 0.5 ) * r, 0, Math.cos( this.time * 0.5 ) * r );
    if (!this.controls) return;
    this.controls.update();
  }
}
