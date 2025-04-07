import { RigidBody, useRapier } from '@react-three/rapier'
import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useThree } from '@react-three/fiber'
import { Billboard, Html, SpotLight } from '@react-three/drei'
import { SpotLightHelper } from 'three'
import { useHelper } from '@react-three/drei'
import RobotModel from './RobotModel'
import * as THREE from 'three'
import HomePageText from './HomePageText'
import CameraFollow from './CameraController'
import Platform from './Platform'
import HangingText from './HangingText'



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
    const [showRobot, setShowRobot] = useState(true)
    

    const spotlightRef1 = useRef()
    const spotlightRef2 = useRef()
  
    // useHelper(spotlightRef, SpotLightHelper, 'teal')

    useEffect(() => {
        if (spotlightRef1.current && targetRef.current) {
            console.log(spotlightRef1.current, targetRef.current, spotlightRef2.current)
            spotlightRef1.current.target = targetRef.current
            spotlightRef2.current.target = targetRef.current
          scene.add(targetRef.current)
        }
      }, [scene])
  
    return (
      <>
        <SpotLight
            ref={spotlightRef1}
            position={[40,200,0]}
            angle={degrees(280)}
            penumbra={0.75}
            intensity={50}
            distance={220}
            castShadow
            color={'skyBlue'}
            target={targetRef.current}
        />
        <SpotLight
            ref={spotlightRef2}
            position={[-40,200,0]}
            angle={degrees(280)}
            penumbra={0.75}
            intensity={50}
            distance={220}
            castShadow
            color={'purple'}
            target={targetRef.current}
        />

<SpotLight
            ref={spotlightRef2}
            position={[0,200,40]}
            angle={degrees(280)}
            penumbra={0.75}
            intensity={50}
            distance={220}
            castShadow
            color={'white'}
            target={targetRef.current}
        />

        <object3D ref={targetRef} position={[0,2,0]}>
        </object3D>

        {/* <HangingText char={'S'} pos={[0,-0.5,0]}/>
        <HangingText char={'O'} pos={[1,-0.5,0]}/>
        <HangingText char={'L'} pos={[2,-0.5,0]}/> */}

        <group scale={2} position={[-1.5, 0, -5]}>
          <HomePageText text={'SOL'} thickness={0.4} type={'dynamic'}/>
        </group>

        <group scale={1} position={[-1.8, 0, -3]}>
          <HomePageText text={'Theory®'} thickness={0.4} type={'dynamic'}/>
        </group>

        <group scale={2} position={[-7, 1, -25]}>
          <HomePageText text={'Find UR Better'} thickness={0.5} type={'dynamic'} charOffset={0.82} col={'white'}/>
        </group>
  
        {showRobot && 
        <>
            <RobotModel bodyRef={ballRef} joystick={joystickData}/>
            <CameraFollow targetRef={ballRef} offset={new THREE.Vector3(-2, 5, 5)} /> 
        </>
        }
  
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