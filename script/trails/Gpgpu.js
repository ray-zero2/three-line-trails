import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer'

export default class Gpgpu {
  constructor(sizeX, sizeY, renderer) {
    this.computeRenderer = new GPUComputationRenderer(sizeX, sizeY, renderer);
    this.time = 0;
    this.values = {
      position: {
        texture: null,
        uniforms: null,
      },
      velocity: {
        texture: null,
        uniforms: null
      }
    }
  }

  update(deltaTime) {
    this.time += deltaTime;

  }
}
