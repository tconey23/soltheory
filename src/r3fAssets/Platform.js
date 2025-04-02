import { RoundedBox } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import { RigidBody, useRapier } from '@react-three/rapier'
import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import HomePageText from './HomePageText'
import HeadModel from '../components/HeadModel'


const degrees = (degrees) => degrees * (Math.PI / 180)

const Platform = ({endpoint, position, dims, fieldDims, bevelRadius, bevelSmoothness, text}) => {
    const platformLight = useRef()
    const platform = useRef()

    const fadeDir = useRef(0)
    const lightMax = 0.5
    const lightMin = 0
    const fieldOpMax = 0.3
    const fieldOpMin = 0
    const decorationLight = useRef(0)
    const [decoractionOpac, setDecorationOpac] = useState(0)

    const [positionx, positiony, positionz] = position

    
    useFrame(() => {
        if (
          fadeDir.current === 1 &&
          platformLight.current &&
          platform.current &&
          platformLight.current.intensity < lightMax
        ) {
          platformLight.current.intensity = Math.min(platformLight.current.intensity + 0.01, lightMax)
          platform.current.material.opacity = Math.min(platform.current.material.opacity + 0.01, fieldOpMax)
          setDecorationOpac(platform.current.material.opacity)
          if (platformLight.current.intensity >= lightMax) fadeDir.current = 0
        }
      
        if (
          fadeDir.current === -1 &&
          platformLight.current &&
          platform.current &&
          platformLight.current.intensity > lightMin
        ) {
          platformLight.current.intensity = Math.max(platformLight.current.intensity - 0.01, lightMin)
          platform.current.material.opacity = Math.max(platform.current.material.opacity - 0.01, fieldOpMin)
          setDecorationOpac(platform.current.material.opacity)
          if (platformLight.current.intensity <= lightMin) fadeDir.current = 0
        }
      })
    
  return (
    <group>
        <mesh name='platform-box' ref={platform} position={position}>
            <boxGeometry args={fieldDims}/>
            <meshStandardMaterial color="white" transparent={true} opacity={0} depthWrite={false}/>
        </mesh>

        <mesh name='platform' position={position}>
            <RigidBody
                type="fixed" 
                friction={0}
                colliders="trimesh"
                onCollisionEnter={({ manifold, target, other }) => {
                    fadeDir.current = 1
                    console.log("Collision detected!")
                    console.log("This body:", target)
                    console.log("Other body:", other)
                
                    // Optional: log position or user data
                    console.log("Other position:", other.translation())
                    console.log("Other userData:", other?.userData)
                }}
                onCollisionExit={() => {
                    fadeDir.current = -1  
                }}
                >
                <RoundedBox    
                    args={dims}
                    radius={bevelRadius}
                    smoothness={bevelSmoothness}
                    >
                    <meshStandardMaterial color="orange" />
                </RoundedBox>
            </RigidBody>
            <HomePageText text={text} type={'static'} pos={[0,0.05,0]} rot={[degrees(-90),degrees(0),degrees(0)]} col={'orange'} prelit={true}/>
            <pointLight position={[0,1,0]} ref={platformLight} intensity={0} color={'white'}/>
        </mesh>
    </group>
  );
};

export default Platform;