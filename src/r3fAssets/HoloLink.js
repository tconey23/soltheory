import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three'
import ForceFieldMaterial from './ForceFieldMaterial';

const HoloLink = () => {

    const spotlight = useRef()
    const spotlightTarget = useRef()
    const matRef = useRef()
    const coneRef = useRef()
    const { scene } = useThree()

    useEffect(() => {
        console.log(scene.children)
    }, [scene.children, spotlight, spotlightTarget])

    useFrame(({ clock }) => {
        if (matRef.current) {
          matRef.current.uTime = clock.getElapsedTime()
        }
      
        if (coneRef.current) {
          coneRef.current.rotation.y = clock.getElapsedTime() * 0.2
        }
      })

    useFrame(() => {

        if(spotlight.current && spotlightTarget.current){
            const targetPos = new THREE.Vector3()
            
            if(!scene.children.includes(spotlight.current.target)){
                scene.add(spotlight.current.target)
            }

            spotlightTarget.current.getWorldPosition(targetPos)
            spotlight.current.target.position.copy(targetPos)
        }

    }, [])


  return (
    <group>

        <group position={[0, 3, 0]} ref={spotlightTarget} userData={{ label: 'spotlight target' }} />

        <mesh ref={coneRef} position={[0, 1, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[2, 10, 64, 1, true]} />
        <forceFieldMaterial
            ref={matRef} 
            transparent
            uColor={new THREE.Color('deepskyblue')}
            uAlpha={1.0}
            blending={THREE.NormalBlending}    
            uFogNear={5}
            uFogFar={15}
            uFogColor={new THREE.Color('black')}
            side={THREE.BackSide}
            depthWrite={false}
         />
      </mesh>

        <spotLight
            ref={spotlight}
            position={[0, 0.1, 0]}
            angle={0.4}
            penumbra={0.5}
            intensity={10}
            distance={15}
        />
    </group>
  );
};

export default HoloLink;