import { useEffect, useState, useRef } from 'react';
import { Stack } from '@mui/material';
import { useGLTF } from '@react-three/drei'
import { MeshStandardMaterial, MeshDepthMaterial, MeshLambertMaterial, MeshPhongMaterial, MeshPhysicalMaterial, DirectionalLight } from 'three'
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';

const degrees = (degrees) => degrees * (Math.PI / 180)


const HeadModel = (props) => {
    const { scene, nodes } = useGLTF('/brain.glb')

    const modelRef = useRef(null)
    const lightRef = useRef(null)
    const pulseDirection = useRef(1); // 1 = increasing, -1 = decreasing

    const lightMin = 0;
    const lightMax = 5000;
    const pulseSpeed = 10;

    useFrame(() => {
        if (modelRef.current && props.autoRotate) {
          modelRef.current.rotation.y += 0.002;
        }
        // const intensity = lightRef.current.intensity;

    // Flip direction if out of bounds
    // if (intensity >= lightMax) pulseDirection.current = -1;
    // if (intensity <= lightMin) pulseDirection.current = 1;

    // Update intensity
    // lightRef.current.intensity += pulseSpeed * pulseDirection.current;
      });
    
    const myMaterial = new MeshStandardMaterial({
        color: 'darkBlue',
        transparent: true,
        opacity: props.opac,
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
  
  return (
        <RigidBody type='fixed' colliders={'cuboid'} restitution={0} friction={1} mass={0}>
    <mesh rotation={[degrees(0),degrees(0),degrees(0)]}>
    {props.prelit &&  
    <>
        {/* <pointLight ref={lightRef} intensity={0.5} color={'darkBlue'} position={[0,1,3]} />
        <pointLight ref={lightRef} intensity={0.5} color={'brightPink'} position={[0,0,0]} /> */}
    </>   
    }
    <primitive ref={modelRef} rotation={[degrees(45),degrees(0),degrees(0)]} object={scene} {...props} />
    </mesh>
        </RigidBody>
    );
};

export default HeadModel;