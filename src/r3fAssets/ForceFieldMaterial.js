import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { extend } from '@react-three/fiber'

// GLSL Shader
const ForceFieldMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('deepSkyBlue'),
    uAlpha: 0.3
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

    void main() {
      float pulse = sin(uTime + vUv.y * 10.0) * 0.2 + 0.8;
      float strength = 1.0 - distance(vUv, vec2(0.5));
      strength = smoothstep(0.0, 1.0, strength);

      vec3 color = uColor * pulse * strength;
      gl_FragColor = vec4(color, strength * uAlpha); // translucent
    }
  `
)

extend({ ForceFieldMaterial })

export default ForceFieldMaterial
