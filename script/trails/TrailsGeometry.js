import * as THREE from "three";

export default class TrailsGeometry extends THREE.BufferGeometry {
  constructor(num, length) {
    super();

    this.num = num;
    this.length = length;
    this.createGeometry();
  }

  createGeometry() {
    const positions = new Float32Array(this.num * this.length * 3);
    const indices = new Uint32Array((this.num * this.length - 1) * 3);
    const uv = new Float32Array(this.num * this.length * 2);

    for(let i = 0; i < this.num; i++) {
        for(let j = 0; j < this.length; j++) {
          const baseIndex = i * this.length + j;

          const c2 = baseIndex * 2;
          const c3 = baseIndex * 3;
          positions[c3] = 0;
          positions[c3 + 1] = 0;
          positions[c3 + 2] = 0;

          uv[c2] = j / this.length;
          uv[c2 + 1] = i / this.num;

          indices[c3] = baseIndex;
          indices[c3 + 1] = Math.min(baseIndex + 1,i * this.length + this.length - 1);;
          indices[c3 + 2] = Math.min(baseIndex + 1,i * this.length + this.length - 1);;
        }
    }

    this.setAttribute('position', new THREE.BufferAttribute( positions, 3 ) );
    this.setAttribute('uv', new THREE.BufferAttribute( uv, 2 ) );
    this.setIndex(new THREE.BufferAttribute(indices,1));
  }
}
