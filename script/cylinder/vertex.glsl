attribute vec3 position;
attribute vec3 normal;
attribute vec3 uv;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;
varying vec3 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
