import { useEffect, useState, useRef } from 'react';
import { Stack } from '@mui/material';
import { useGLTF } from '@react-three/drei'
import { MeshStandardMaterial, MeshDepthMaterial, MeshLambertMaterial, MeshPhongMaterial, MeshPhysicalMaterial, DirectionalLight } from 'three'
import { useFrame } from '@react-three/fiber';


const HeadModel = (props) => {
    const { scene, nodes } = useGLTF('/brain.glb')
    const degrees = (degrees) => degrees * (Math.PI / 180)

    const modelRef = useRef(null)
    const lightRef = useRef(null)
    const pulseDirection = useRef(1); // 1 = increasing, -1 = decreasing

    const lightMin = 0;
    const lightMax = 5000;
    const pulseSpeed = 10;

    useFrame(() => {
        if (modelRef.current) {
          modelRef.current.rotation.y += 0.002;
        //   modelRef.current.rotation.z += 0.002;
        // modelRef.current.rotation.x += 0.002
        }
        const intensity = lightRef.current.intensity;

    // Flip direction if out of bounds
    if (intensity >= lightMax) pulseDirection.current = -1;
    if (intensity <= lightMin) pulseDirection.current = 1;

    // Update intensity
    lightRef.current.intensity += pulseSpeed * pulseDirection.current;
      });
    
    const myMaterial = new MeshStandardMaterial({
        color: 'darkBlue',
        transparent: true,
        opacity: 0.8,
        metalness: 1,
        roughness: 0.15
    });

  const targetMesh = scene.getObjectByName("Sketchfab_model"); // Replace with actual mesh name
  const childMesh = targetMesh.getObjectByName("finalstlcleanermaterialmergergles")
  if (childMesh) childMesh.material = myMaterial;
  scene.material=myMaterial

  childMesh.children.forEach((c) => {
    c.material = myMaterial
  })

  console.log(scene, childMesh.children)

  return (
    <>
        <pointLight ref={lightRef} intensity={0} color={'darkBlue'} position={[0,1,3]} />
        <pointLight ref={lightRef} intensity={0} color={'brightPink'} position={[0,0,3]} />
        <primitive ref={modelRef} rotation={[degrees(45),degrees(0),degrees(0)]} object={scene} {...props} />
    </>
    );
};

export default HeadModel;