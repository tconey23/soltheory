import { RigidBody, useRapier } from '@react-three/rapier'
import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import HomePageText from './HomePageText'
import CameraFollow from './CameraController'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import HeadModel from '../components/HeadModel'
import Platform from './Platform'
import { Billboard, Html, SpotLight } from '@react-three/drei'
import { SpotLightHelper } from 'three'
import { useHelper } from '@react-three/drei'
import Robot from './Robot'
import RobotModel from './RobotModel'
import Joystick from './Joystick'



const degrees = (degrees) => degrees * (Math.PI / 180)

const Ball = ({ bodyRef }) => {
    const speed = 0.1
  
    const keys = useRef({
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
    })
  
    useEffect(() => {
      const down = (e) => (keys.current[e.code] = true)
      const up = (e) => (keys.current[e.code] = false)
      window.addEventListener('keydown', down)
      window.addEventListener('keyup', up)
      return () => {
        window.removeEventListener('keydown', down)
        window.removeEventListener('keyup', up)
      }
    }, [])
  
    useFrame(() => {
      if (!bodyRef.current) return
  
      const impulse = new THREE.Vector3()
  
      if (keys.current['ArrowUp']) impulse.z -= speed
      if (keys.current['ArrowDown']) impulse.z += speed
      if (keys.current['ArrowLeft']) impulse.x -= speed
      if (keys.current['ArrowRight']) impulse.x += speed
  
      if (impulse.lengthSq() > 0) {
        bodyRef.current.applyImpulse(impulse, true)
      }
    })
  
    return (
        <>
      <RigidBody
        ref={bodyRef}
        colliders="ball"
        type="dynamic"
        restitution={0.5}
        friction={0.1}
        linearDamping={1.5} 
        angularDamping={1.5}
        mass={100000000}
        enabledRotations={[false, false, false]} 
      >
        <mesh position={[0, 1, 0]} castShadow receiveShadow>
          <pointLight castShadow intensity={3} distance={10} color={'blue'}/>
          <ambientLight intensity={0.02}/>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="deepskyblue" transparent={false} opacity={0.8} metalness={1} roughness={0.1}/>
        </mesh>
      </RigidBody>
        </>
    )
  }

  const BallLandscape = ({joystickData}) => {
    const ballRef = useRef()
    const spotLightRef = useRef()
    const targetRef = useRef()
    const { scene } = useThree()
    

    const spotlightRef = useRef()
  
    // useHelper(spotlightRef, SpotLightHelper, 'teal')

    useEffect(() => {
        if (spotlightRef.current && targetRef.current) {
          spotlightRef.current.target = targetRef.current
          scene.add(targetRef.current)
        }
      }, [scene])
  
    return (
      <>
        <group scale={2} position={[-1.5, 0, -5]}>
            <directionalLight color={'grey'} castShadow intensity={0.08} position={[0,10,-10]} />
        <SpotLight
            ref={spotlightRef}
            position={[2,0.5,0]}
            angle={degrees(180)}
            penumbra={0.8}
            intensity={50}
            distance={6}
            castShadow
            target={targetRef.current}
        />
          <HomePageText text={'SOL'} thickness={0.4} type={'dynamic'}/>
        </group>

        <group scale={1} position={[-1.8, 0, -3]}>
          <HomePageText text={'Theory®'} thickness={0.4} type={'dynamic'}/>
        </group>

        <group scale={2} position={[-7, 1, -25]}>
          <HomePageText text={'Find UR Better'} thickness={0.5} type={'dynamic'} charOffset={0.82} col={'white'}/>
        </group>
  
        <RobotModel bodyRef={ballRef} joystick={joystickData}/>
        <CameraFollow targetRef={ballRef} offset={new THREE.Vector3(-2, 5, 5)} />
  
        <RigidBody userData='floor-plane' type="fixed">
          <mesh receiveShadow position={[0, -1, 0]}>
            <boxGeometry args={[1000, 1, 1000]} />
            <meshStandardMaterial color="grey" />
          </mesh>
        </RigidBody>


        <Platform position={[0, -0.53, -30]} fieldDims={[4.8, 5, 4.8]} dims={[5, 0.08, 5]} bevelRadius={0.1} bevelSmoothness={8} text={'Games'} endpoint={'/games'} clickText={'See Games'} triggerObject={'robot-mesh'}/>
        
        
        <Platform position={[20, -0.53, -30]} fieldDims={[4.8, 5, 4.8]} dims={[5, 0.08, 5]} bevelRadius={0.1} bevelSmoothness={8} text={'ESC'} endpoint={'/esc'} clickText={'See ESCs'} triggerObject={'robot-mesh'}/>
      </>
    )
  }

export default BallLandscape;