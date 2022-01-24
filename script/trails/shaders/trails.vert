#include <common>
uniform sampler2D texturePosition;
uniform vec3 colors;

varying vec4 vColor;

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec3 pos = texture2D( texturePosition, uv ).xyz;

    vec3 hsvColor = hsv2rgb(vec3(colors.x + uv.y / 5., 1.,  1. ));
    vColor = vec4(hsvColor , 1.);

    vec4 mvPosition = modelViewMatrix * vec4( pos + position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
}
