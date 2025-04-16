import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { extend } from '@react-three/fiber'

// GLSL Shader
const ForceFieldMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('deepSkyBlue'),
    uAlpha: 0.2,
    uInt: 100,
    uMult: 1
  },
  // Vertex Shader
  `
    varying vec3 vPosition;
    varying vec2 vUv;
    void main() {
      vPosition = position;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec3 vPosition;
  varying vec2 vUv;
  uniform float uAlpha;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform vec3 uFogColor;
  uniform float uInt;
  uniform float uMult;

    void main() {
      float pulse = sin(uTime * uMult + vUv.y * uInt) * 0.8 + 0.8;
      pulse = pow(pulse, 2.0);
      float adjustedU = mod(vUv.x + 0.5, 1.0); // Shifts U to center seam
      float strength = 1.0 - distance(vec2(adjustedU, vUv.y), vec2(0.5));


      strength = smoothstep(0.0, 1.0, strength);

      vec3 color = uColor * pulse * strength;
      gl_FragColor = vec4(color, strength * uAlpha); // translucent
    }
  `
)

extend({ ForceFieldMaterial })

export default ForceFieldMaterial
