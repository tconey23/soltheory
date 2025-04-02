import { useEffect, useState, useRef } from 'react';
import { Stack } from '@mui/material';
import { useGLTF } from '@react-three/drei'
import { MeshStandardMaterial, MeshDepthMaterial, MeshLambertMaterial, MeshPhongMaterial, MeshPhysicalMaterial, DirectionalLight } from 'three'
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';

const degrees = (degrees) => degrees * (Math.PI / 180)

const HumanModel = (props) => {

    const { scene, nodes } = useGLTF('/generalized_human_body.glb')

    const modelRef = useRef(null)
    const lightRef = useRef(null)

    const myMaterial = new MeshStandardMaterial({
        color: 'darkBlue',
        transparent: true,
        opacity: 0.8,
        metalness: 1,
        roughness: 0.15
    });


  return (
        <RigidBody type='fixed' colliders={'cuboid'} restitution={0} friction={1} mass={0}>
            <mesh rotation={[degrees(0),degrees(0),degrees(0)]}>
                <pointLight ref={lightRef} intensity={5} color={'darkBlue'} position={[0,1,3]} />
                <pointLight ref={lightRef} intensity={0} color={'brightPink'} position={[0,0,3]} />
                    <primitive ref={modelRef} rotation={[degrees(45),degrees(0),degrees(0)]} object={scene} {...props} />
            </mesh>
        </RigidBody>
  );
};

export default HumanModel;