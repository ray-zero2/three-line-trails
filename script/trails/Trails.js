import * as THREE from 'three';
import TrailsGeometry from './TrailsGeometry';

import trailsVs from './shaders/trails.vert?raw';
import trailsFs from './shaders/trails.frag?raw';
import computePositionFrag from './shaders/computePosition.frag?raw';
import computeVelocityFrag from './shaders/computeVelocity.frag?raw';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer';


export default class Trails extends THREE.Mesh {
  constructor(renderer, num, length, options) {
    const geometry = new TrailsGeometry(num, length);
    const material = new THREE.ShaderMaterial({
      vertexShader: trailsVs,
      fragmentShader: trailsFs,
      transparent: true,
      // blending: THREE.CustomBlending,
      // blendEquation: THREE.AddEquation,
      // blendSrc: THREE.SrcColorFactor,
      // blendDst: THREE.OneMinusSrcColorFactor,
      uniforms: {
        texturePosition: {
          value: new THREE.Texture(),
        },
        textureVelocity: {
          value: new THREE.Texture()
        },
        colors: {
          value: new THREE.Vector3(
            Math.random(),
            Math.random(),
            Math.random()
          )
        }
      }
    })
    material.wireframe = true;
    // const material = new THREE.MeshBasicMaterial({
    //   color: '#ff0000'
    // });
    super(geometry, material);

    this.length = length;
    this.num = num;
    this.time = 0;
    // this.material.needsUpdate = true
    this.matrixAutoUpdate = false;
    this.updateMatrix();
    this.computeRenderer = new GPUComputationRenderer(length, num, renderer);
    this.computeValues = {
      position: {
        texture: null,
        uniforms: null
      },
      velocity: {
        texture: null,
        uniforms: null
      }
    }
    const initPositionTex = this.computeRenderer.createTexture();
    const initVelocityTex = this.computeRenderer.createTexture();

    this.initPosition(initPositionTex);

    this.computeValues.position.texture = this.computeRenderer.addVariable('texturePosition', computePositionFrag, initPositionTex)
    this.computeValues.velocity.texture = this.computeRenderer.addVariable('textureVelocity', computeVelocityFrag, initVelocityTex)

    this.computeRenderer.setVariableDependencies(this.computeValues.position.texture, [ this.computeValues.position.texture, this.computeValues.velocity.texture] )
    this.computeValues.position.uniforms = this.computeValues.position.texture.material.uniforms;

    this.computeRenderer.setVariableDependencies(this.computeValues.velocity.texture, [ this.computeValues.position.texture, this.computeValues.velocity.texture] )
    this.computeValues.velocity.uniforms = this.computeValues.velocity.texture.material.uniforms;
    this.computeValues.velocity.uniforms.time = { value: 0 }
    this.computeValues.velocity.uniforms.seedX = { value: 0 }
    this.computeValues.velocity.uniforms.seedY = { value: 0 }
    this.computeValues.velocity.uniforms.seedZ = { value: 0 }

    this.computeRenderer.init();

    this.gui = options?.gui;
    this.setupSettings();
  }

  /**
   *
   * @param {THREE.Texture} tex
   */
  initPosition(tex) {
    const textureArray = tex.image.data;
    const range = new THREE.Vector3(
      Math.random()*3,
      Math.random()*3,
      Math.random()*3
    );

    for(let i = 0; i < textureArray.length; i += this.length * 4) {
      const x = Math.random() * range.x - range.x/2;
      const y = Math.random() * range.y - range.y/2;
      const z = Math.random() * range.z - range.z/2;

      for(let j = 0; j < this.length * 4; j += 4){
        textureArray[i + j + 0] = x;
        textureArray[i + j + 1] = y;
        textureArray[i + j + 2] = z;
        textureArray[i + j + 3] = 0.0;
      }
    }
  }

  update(deltaTime) {
    // this.material.needsUpdate = true
    this.time += deltaTime;

    this.computeValues.velocity.uniforms.time.value = this.time;
    this.computeValues.velocity.uniforms.seedX.value = this.settings.seedX;
    this.computeValues.velocity.uniforms.seedY.value = this.settings.seedY;
    this.computeValues.velocity.uniforms.seedZ.value = this.settings.seedZ;
    this.computeRenderer.compute();

    this.material.uniforms.texturePosition.value = this.computeRenderer.getCurrentRenderTarget(this.computeValues.position.texture).texture;
    this.material.uniforms.textureVelocity.value = this.computeRenderer.getCurrentRenderTarget(this.computeValues.velocity.texture).texture;
  }

  setupSettings() {
    if(!this.gui) return;
    this.settings = {
      seedX:  Math.random() * 10,
      seedY:  Math.random() * 10,
      seedZ:  Math.random() * 10,
    }
    this.gui.add(this.settings, 'seedX', 0, 10, 0.0001);
    this.gui.add(this.settings, 'seedY', 0, 10, 0.0001);
    this.gui.add(this.settings, 'seedZ', 0, 10, 0.0001);
  }
}
