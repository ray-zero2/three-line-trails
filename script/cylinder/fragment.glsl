precision highp float;
uniform float time;
uniform sampler2D texture;
varying vec3 vUv;

void main() {
  vec2 uv = vec2(1. - vUv.y, vUv.x);
  uv = fract(uv.xy * vec2(1., 8.) );
  vec4 tex = texture2D(texture, uv);
  if(tex.a <= .3) {
    discard;
  } else {
    gl_FragColor = tex;
  }
}
