import * as THREE from 'three'
import vertex from './vertex.glsl?raw'
import fragment from './fragment.glsl?raw'

export default class Cylinder extends THREE.Mesh {
  constructor(texture) {
    const geometry = new THREE.CylinderGeometry(5, 5, 18, 32, 1, true);
    const material = new THREE.RawShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        time: {
          value: 0
        },
        texture: {
          value: texture
        }
      },
      side: THREE.DoubleSide
    });
    super(geometry, material);
    this.time = 0;
    this.rotateZ(Math.PI/2);
  }

  update(deltaTime) {
    this.time += deltaTime;
    const time = this.time;
    this.material.uniforms.time.value = time;
    this.rotation.x = time / 5;
  }
}
