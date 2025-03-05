import React, { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";

const Rings = () => {
    const numRings = 3; // Number of rings
  const sphereRefs = useRef([]);
  const eyeballRef = useRef();
  const [eyeTarget, setEyeTarget] = useState({ x: 0, z: 0 });
  const { viewport } = useThree(); // Get screen size to adjust movement

  const eyeRadius = 0.5; // Maximum movement boundary (adjust based on "O" size)

  const minX = -0.23, maxX = 0.23; // Left/Right movement range
  const minZ = -0.5, maxZ = 0.10; // Forward/Backward movement range

  useFrame(({ clock, mouse }) => {
    const time = clock.getElapsedTime();

    // Animate the orbiting spheres
    sphereRefs.current.forEach((sphere, index) => {
      if (sphere) {
        const radius = index + 4; // Match ring radius
        const speed = 0.5 + index * 0.2; // Different speeds per ring
        const angle = time * speed;
        sphere.position.x = radius * Math.cos(angle);
        sphere.position.z = radius * Math.sin(angle);
      }
    });

    if (eyeballRef.current) {
        // Convert mouse movement (-1 to 1) into 3D space
        let targetX = mouse.x * (viewport.width / 5);
        let targetZ = -mouse.y * (viewport.height / 5); // Correct Z movement
  
        // Clamp movement within both min and max ranges
        targetX = Math.max(minX, Math.min(maxX, targetX));
        targetZ = Math.max(minZ, Math.min(maxZ, targetZ));
  
        // Smooth movement using lerp
        eyeballRef.current.position.x += (targetX - eyeballRef.current.position.x) * 0.1;
        eyeballRef.current.position.z += (targetZ - eyeballRef.current.position.z) * 0.1;
      } 
  });

  return (
    <>
      {/* Generate Rings */}
      {Array.from({ length: numRings }).map((_, index) => (
        <mesh rotation={[Math.PI / 2, 0, 0]} key={`ring-${index}`}>
          <torusGeometry args={[index + 4, 0.05, 16, 64]} />
          <meshStandardMaterial attach="material" color="silver" metalness={1.3} roughness={0.5} />
        </mesh>
      ))}

      {/* Generate Animated Spheres */}
      {Array.from({ length: numRings }).map((_, index) => (
        <mesh key={`sphere-${index}`} ref={(el) => (sphereRefs.current[index] = el)}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial attach="material" color="silver" metalness={1.3} roughness={0.5} />
        </mesh>
      ))}

      {/* Eyeball Looking Around Randomly */}
      <mesh ref={eyeballRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} /> {/* Eyeball size */}
        <meshStandardMaterial attach="material" color="silver" metalness={1.3} roughness={0.5} />
      </mesh>
    </>
  );
};

export default Rings;
