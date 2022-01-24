import{P as d,O as m,V as l,B as x,a as u,M as v,S as p,T as h,G as y,W as g,b as f,C as w,c as z,d as b}from"./vendor.2e3bd11a.js";const C=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function n(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerpolicy&&(i.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?i.credentials="include":t.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(t){if(t.ep)return;t.ep=!0;const i=n(t);fetch(t.href,i)}};C();class V extends d{constructor(e={}){super(e==null?void 0:e.fov,e==null?void 0:e.aspect,e==null?void 0:e.near,e==null?void 0:e.far);var n;this.time=0,this.enableControl=e==null?void 0:e.enableControl,!!(e==null?void 0:e.canvas)&&(!this.enableControl||(this.controls=new m(this,e==null?void 0:e.canvas),this.controls.enableDamping=(e==null?void 0:e.enableDamping)||!1,this.controls.dampingFactor=(n=e==null?void 0:e.dampingFactor)!=null?n:.2))}init(){this.position.set(-10,5,5),this.lookAt(new l(0,0,0))}resize(e){this.aspect=e.x/e.y,this.updateProjectionMatrix()}update(e){const n=14;this.time+=e,this.position.set(Math.sin(this.time*.5)*n,0,Math.cos(this.time*.5)*n),this.lookAt(0,0,0),!!this.controls&&this.controls.update()}}class M extends x{constructor(e,n){super();this.num=e,this.length=n,this.createGeometry()}createGeometry(){const e=new Float32Array(this.num*this.length*3),n=new Uint32Array((this.num*this.length-1)*3),s=new Float32Array(this.num*this.length*2);for(let t=0;t<this.num;t++)for(let i=0;i<this.length;i++){const o=t*this.length+i,a=o*2,r=o*3;e[r]=0,e[r+1]=0,e[r+2]=0,s[a]=i/this.length,s[a+1]=t/this.num,n[r]=o,n[r+1]=Math.min(o+1,t*this.length+this.length-1),n[r+2]=Math.min(o+1,t*this.length+this.length-1)}this.setAttribute("position",new u(e,3)),this.setAttribute("uv",new u(s,2)),this.setIndex(new u(n,1))}}var P=`#include <common>
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
`,D=`varying vec4 vColor;
void main() {
    gl_FragColor = vColor;
}
`,F=`void main() {
    if(gl_FragCoord.x <= 1.0){
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec3 pos = texture2D( texturePosition, uv ).xyz;
        vec3 vel = texture2D( textureVelocity, uv ).xyz;

        pos += vel * 0.01;
        gl_FragColor = vec4(pos,1.0);

    }else{
        vec2 bUV = (gl_FragCoord.xy - vec2(1.0,0.0)) / resolution.xy;
        vec3 bPos = texture2D( texturePosition, bUV ).xyz;
        gl_FragColor = vec4(bPos,1.0);
    }
}
`,R=`uniform float time;
uniform float seedX;
uniform float seedY;
uniform float seedZ;

// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
//

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0; }

float mod289(float x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0; }

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

float permute(float x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float taylorInvSqrt(float r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec4 grad4(float j, vec4 ip)
  {
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p,s;

  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;

  return p;
  }

// (sqrt(5) - 1)/4 = F4, used once below
#define F4 0.309016994374947451

float snoise(vec4 v)
  {
  const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4
                        0.276393202250021,  // 2 * G4
                        0.414589803375032,  // 3 * G4
                       -0.447213595499958); // -1 + 4 * G4

// First corner
  vec4 i  = floor(v + dot(v, vec4(F4)) );
  vec4 x0 = v -   i + dot(i, C.xxxx);

// Other corners

// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
  vec4 i0;
  vec3 isX = step( x0.yzw, x0.xxx );
  vec3 isYZ = step( x0.zww, x0.yyz );
//  i0.x = dot( isX, vec3( 1.0 ) );
  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;
//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;
  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  // i0 now contains the unique values 0,1,2,3 in each channel
  vec4 i3 = clamp( i0, 0.0, 1.0 );
  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

  //  x0 = x0 - 0.0 + 0.0 * C.xxxx
  //  x1 = x0 - i1  + 1.0 * C.xxxx
  //  x2 = x0 - i2  + 2.0 * C.xxxx
  //  x3 = x0 - i3  + 3.0 * C.xxxx
  //  x4 = x0 - 1.0 + 4.0 * C.xxxx
  vec4 x1 = x0 - i1 + C.xxxx;
  vec4 x2 = x0 - i2 + C.yyyy;
  vec4 x3 = x0 - i3 + C.zzzz;
  vec4 x4 = x0 + C.wwww;

// Permutations
  i = mod289(i);
  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

// Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope
// 7*7*6 = 294, which is close to the ring size 17*17 = 289.
  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

// Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));

// Mix contributions from the five corners
  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

  }


// vec3 snoiseDelta(vec3 pos){
//     float dlt = 0.0001;
//     vec3 a = snoise3D(pos);
//     vec3 b = snoise3D(vec3(pos.x + dlt,pos.y + dlt,pos.z + dlt));
//     vec3 dt = vec3(a.x - b.x,a.y - b.y,a.z - b.z) / dlt;
//     return dt;
// }


void main() {
    if(gl_FragCoord.x >= 1.0) return;

    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 pos = texture2D( texturePosition, uv ).xyz;
    vec3 vel = texture2D( textureVelocity, uv ).xyz;
    // float idParticle = uv.y * resolution.x + uv.x;

    vel.xyz += 40.0 * vec3(
      snoise( vec4( 0.1 * pos.xyz, seedX + 0.5 * time ) ),
      snoise( vec4( 0.1 * pos.xyz, seedY + 0.5 * time ) ),
      snoise( vec4( 0.1 * pos.xyz, seedZ + 0.5 * time ) )
    ) * 0.2;
    vel += -pos * length(pos) * 0.1;
    vel.xyz *= 0.9 + abs(sin(uv.y * 9.0)) * 0.03;

    gl_FragColor = vec4( vel.xyz, 1.0 );
}
`;class A extends v{constructor(e,n,s,t){const i=new M(n,s),o=new p({vertexShader:P,fragmentShader:D,transparent:!0,uniforms:{texturePosition:{value:new h},textureVelocity:{value:new h},colors:{value:new l(Math.random(),Math.random(),Math.random())}}});o.wireframe=!0;super(i,o);this.length=s,this.num=n,this.time=0,this.matrixAutoUpdate=!1,this.updateMatrix(),this.computeRenderer=new y(s,n,e),this.computeValues={position:{texture:null,uniforms:null},velocity:{texture:null,uniforms:null}};const a=this.computeRenderer.createTexture(),r=this.computeRenderer.createTexture();this.initPosition(a),this.computeValues.position.texture=this.computeRenderer.addVariable("texturePosition",F,a),this.computeValues.velocity.texture=this.computeRenderer.addVariable("textureVelocity",R,r),this.computeRenderer.setVariableDependencies(this.computeValues.position.texture,[this.computeValues.position.texture,this.computeValues.velocity.texture]),this.computeValues.position.uniforms=this.computeValues.position.texture.material.uniforms,this.computeRenderer.setVariableDependencies(this.computeValues.velocity.texture,[this.computeValues.position.texture,this.computeValues.velocity.texture]),this.computeValues.velocity.uniforms=this.computeValues.velocity.texture.material.uniforms,this.computeValues.velocity.uniforms.time={value:0},this.computeValues.velocity.uniforms.seedX={value:0},this.computeValues.velocity.uniforms.seedY={value:0},this.computeValues.velocity.uniforms.seedZ={value:0},this.computeRenderer.init(),this.gui=t==null?void 0:t.gui,this.setupSettings()}initPosition(e){const n=e.image.data,s=new l(Math.random()*3,Math.random()*3,Math.random()*3);for(let t=0;t<n.length;t+=this.length*4){const i=Math.random()*s.x-s.x/2,o=Math.random()*s.y-s.y/2,a=Math.random()*s.z-s.z/2;for(let r=0;r<this.length*4;r+=4)n[t+r+0]=i,n[t+r+1]=o,n[t+r+2]=a,n[t+r+3]=0}}update(e){this.time+=e,this.computeValues.velocity.uniforms.time.value=this.time,this.computeValues.velocity.uniforms.seedX.value=this.settings.seedX,this.computeValues.velocity.uniforms.seedY.value=this.settings.seedY,this.computeValues.velocity.uniforms.seedZ.value=this.settings.seedZ,this.computeRenderer.compute(),this.material.uniforms.texturePosition.value=this.computeRenderer.getCurrentRenderTarget(this.computeValues.position.texture).texture,this.material.uniforms.textureVelocity.value=this.computeRenderer.getCurrentRenderTarget(this.computeValues.velocity.texture).texture}setupSettings(){!this.gui||(this.settings={seedX:Math.random()*10,seedY:Math.random()*10,seedZ:Math.random()*10},this.gui.add(this.settings,"seedX",0,10,1e-4),this.gui.add(this.settings,"seedY",0,10,1e-4),this.gui.add(this.settings,"seedZ",0,10,1e-4))}}class S{constructor(e){this.canvas=e,this.time=0,this.resolution={x:window.innerWidth,y:window.innerHeight},this.renderer=new g({canvas:e,alpha:!0,antialias:!0}),this.scene=new f,this.camera=new V({fov:50,aspect:this.resolution.x/this.resolution.y,far:1e3,canvas:e,enableControl:!1}),this.clock=new w(!0),this.trails=null,this.stats=new z,this.gui=new b,this.init().then(this.start.bind(this))}resize(e,n){this.resolution.x=e,this.resolution.y=n,this.renderer.setSize(this.resolution.x,this.resolution.y),this.camera.resize(this.resolution)}async init(){document.body.appendChild(this.stats.dom);const e=4096/4,n=32;console.log(`trails => num: ${e}, length: ${n}`),this.trails=new A(this.renderer,e,n,{gui:this.gui}),this.scene.add(this.trails),this.camera.init(),this.setRenderer(),this.bind()}start(){this.animate()}animate(){const e=this.clock.getDelta();this.time+=e,this.camera.update(e),this.trails.update(e),this.renderer.render(this.scene,this.camera),this.stats.update(),requestAnimationFrame(this.animate.bind(this))}setRenderer(){this.renderer.setSize(this.resolution.x,this.resolution.y),this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.clearColor("#ffffff")}toggleDisplay(){this.stats.dom.classList.toggle("is-hidden"),this.gui.domElement.classList.toggle("is-hidden")}handleKeyDown(e){e.key==="d"&&this.toggleDisplay()}bind(){window.addEventListener("keydown",this.handleKeyDown.bind(this),{passive:!0})}}class L{constructor(){const e=document.querySelector("#canvas");this.glContent=new S(e),this.bind()}bind(){window.addEventListener("resize",this.handleResize.bind(this))}handleResize(){this.glContent.resize(window.innerWidth,window.innerHeight)}}new L;
