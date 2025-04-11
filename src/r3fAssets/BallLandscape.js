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
import AcronymScene from './AcronymScene'
import { interactionGroups } from '@react-three/rapier'

const degrees = (degrees) => degrees * (Math.PI / 180)

  const BallLandscape = ({joystickData}) => {
    const ballRef = useRef()
    const spotLightRef = useRef()
    const targetRef = useRef()
    const letters = useRef()
    const { scene } = useThree()
    const [showRobot, setShowRobot] = useState(true)
    

    const spotlightRef1 = useRef()
    const spotlightRef2 = useRef()
  
    // useHelper(spotlightRef, SpotLightHelper, 'teal')

    useEffect(() => {
        if (spotlightRef1.current && targetRef.current) {
            spotlightRef1.current.target = targetRef.current
            spotlightRef2.current.target = targetRef.current
          scene.add(targetRef.current)
        }
      }, [scene])

      useEffect(() =>{
        if(letters.current){
          const intervalId = setInterval(() => {
            // setShowRobot(true)
          }, 2000)
        
          return () => clearInterval(intervalId)
        }
      }, [letters])
  
    return (
      <>
        {/* <SpotLight
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
        /> */}

        {/* <object3D ref={targetRef} position={[0,2,0]}>
        </object3D> */}

      {/* <group ref={letters}>
        <group scale={2} position={[-1.5, 1, -5]}>
          <HomePageText text={'SOL'} thickness={0.4} type={'dynamic'} pos={[-1.5, 1, -5]}/>
        </group>

        <group scale={1} position={[-1.8, 1, -3]}>
          <HomePageText text={'Theory®'} thickness={0.4} type={'dynamic'} pos={[-1.8, 1, -3]}/>
        </group>

        <group scale={2} position={[-7, 1, -25]}>
          <HomePageText text={'Find UR Better'} thickness={0.5} type={'dynamic'} charOffset={0.82} col={'white'} pos={[-7, 1, -25]}/>
        </group>
      </group> */}
  
        {showRobot && 
        <>
            <RobotModel bodyRef={ballRef} joystick={joystickData}/>
            <CameraFollow targetRef={ballRef} offset={new THREE.Vector3(-2, 5, 5)} /> 
        </>
        }

        {/* <AcronymScene /> */}
  
        <RigidBody userData='floor-plane' type="fixed" colliders='cuboid' collisionGroups={interactionGroups([3], [0,1,2])}>
          <mesh receiveShadow position={[0, -1, 0]}>
            <boxGeometry args={[1000, 1, 1000]} />
            <meshStandardMaterial color="grey" />
          </mesh>
        </RigidBody>


        {/* <Platform position={[0, -0.53, -30]} fieldDims={[4.8, 5, 4.8]} dims={[5, 0.08, 5]} bevelRadius={0.1} bevelSmoothness={8} text={'Games'} endpoint={'/games'} clickText={'See Games'} triggerObject={'robot-mesh'}/> */}
        
        
        {/* <Platform position={[20, -0.53, -30]} fieldDims={[4.8, 5, 4.8]} dims={[5, 0.08, 5]} bevelRadius={0.1} bevelSmoothness={8} text={'ESC'} endpoint={'/esc'} clickText={'See ESCs'} triggerObject={'robot-mesh'}/> */}
      </>
    )
  }

export default BallLandscape;