import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { extend } from '@react-three/fiber'

// GLSL Shader
const ForceFieldMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('deepSkyBlue'),
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
    uniform float uAlpha;
    uniform float uFogNear;
    uniform float uFogFar;
    uniform vec3 uFogColor;

    varying vec3 vPosition;
    varying vec2 vUv;

    void main() {
      float pulse = sin(uTime + vUv.y * 10.0) * 0.2 + 0.8;
      float adjustedU = mod(vUv.x + 0.5, 1.0);
      float strength = 1.0 - distance(vec2(adjustedU, vUv.y), vec2(0.5));
      strength = smoothstep(0.0, 1.0, strength);

      vec3 color = uColor * pulse * strength;

      float depth = gl_FragCoord.z / gl_FragCoord.w;
      float fogFactor = smoothstep(uFogNear, uFogFar, depth);
      vec3 finalColor = mix(color, uFogColor, fogFactor);

      gl_FragColor = vec4(finalColor, strength * uAlpha);
    }

  `
)

extend({ ForceFieldMaterial })

export default ForceFieldMaterial
