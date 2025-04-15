// File: src/scenes/BallLandscapeOptimized.js
import { memo, Suspense, useEffect, useRef, useMemo, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { useTexture, Environment, Lightformer, useProgress } from '@react-three/drei'
import { RigidBody, CuboidCollider, interactionGroups } from '@react-three/rapier'
import * as THREE from 'three'
import RobotModel from './RobotModel'
import CameraFollow from './CameraController'
import Platform from './Platform'
import HomePageText from './HomePageText'
import { create } from 'zustand'
import CanvasLoading from './CanvasLoading'
import { Fog } from 'three'
import HoloLink from './HoloLink'

const useUIStore = create((set) => ({
  isLoading: true,
  showRobot: false,
  turnAround: true,
  showEnvironment: false,
  showPlatforms: false,


  setIsLoading: (val) => set({ isLoading: val }),
  setShowRobot: (val) => set({ showRobot: val }),
  setTurnAround: (val) => set({ turnAround: val }),
  setShowEnvironment: (val) => set({ showEnvironment: val }),
  setShowPlatforms: (val) => set({ showPlatforms: val }),
}))

const degrees = (d) => d * (Math.PI / 180)

const BallLandscape = memo(({ joystickData }) => {
  const { scene } = useThree()
  const ballRef = useRef()
  const teleport = useRef()

  const [showTeleport, setShowTeleport] = useState(false)
  const [teleportHeight, setTeleportHeight] = useState(-6)

  useEffect(() => {
    if(teleport.current){
      console.log(teleport.current)
    }
  }, [teleport])

  // Zustand state
  const {
    isLoading,
    setIsLoading,
    showRobot,
    setShowRobot,
    turnAround,
    setTurnAround,
    showPlatforms,
    setShowPlatforms,
    showEnvironment,
    setShowEnvironment
  } = useUIStore()

  // Load textures


  // Trigger scene ready state
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false)
      setShowRobot(true)
      setShowPlatforms(true)
      setShowEnvironment(true)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [])



  return (
    <Suspense fallback={<CanvasLoading />}>
      
      <group position={[0,0,-5]} >
        <group scale={6} position={[-8, 2, -5]}>
          <HomePageText text={'SOL'} thickness={0.4} type={'dynamic'} pos={[-1.5, 1, -5]} />
        </group>
        <group scale={3} position={[-8, 3, -2]}>
          <HomePageText text={'Theory'} thickness={0.4} type={'dynamic'} pos={[-1.8, 1, -3]} />
        </group>
      </group>

      {showRobot && (
        <>
          <RobotModel bodyRef={ballRef} joystick={joystickData} setTurnAround={setTurnAround} turnAround={turnAround} />
          <CameraFollow turnAround={turnAround} setTurnAround={setTurnAround} targetRef={ballRef} offset={new THREE.Vector3(-2, 5, 5)} />
        </>
      )}


      
        <group ref={teleport} position={[5,6,0]} >
          <HoloLink teleport={teleport} setShowTeleport={setShowTeleport} showTeleport={showTeleport} teleportHeight={teleportHeight} setTeleportHeight={setTeleportHeight} />
        </group>

      <group  rotation={[degrees(4.5), degrees(0), degrees(0)]} >
        <RigidBody
             type='fixed' 
             colliders={false}
             position={[-16,0,-28]}
             >
                <CuboidCollider
                 args={[4,1,4]} 
                 position={[16,0,0]}
                 onIntersectionEnter={() => setShowTeleport(true)}
                //  onIntersectionExit={() => setShowTeleport(false)}
                 sensor
                />
            </RigidBody>
      </group>

      {showEnvironment && (
        <>
        <Environment
        shadows
        castShadow
        receiveShadow
        resolution={720}
        preset={null}
        background
        backgroundBlurriness={0}
        backgroundIntensity={0.1}
        backgroundRotation={[degrees(0), degrees(-250), degrees(0)]}
        environmentIntensity={0.08}
        environmentRotation={[0, degrees(0), 0]}
        files={'/puresky.hdr'}
        >
          <Lightformer form="ring" color="rebeccapurple" intensity={100} rotation-x={Math.PI / 2} position={[0, 10, 0]} scale={[10, 1, 1]} />
          <Lightformer form="ring" color="limeGreen" intensity={100} rotation-z={degrees(45)} position={[0, 10, 0]} scale={[9, 1, 1]} />
          <Lightformer form="ring" color="deepSkyBlue" intensity={80} rotation-z={degrees(-90)} position={[5, 10, 0]} scale={[10, 1, 1]} />
          <Lightformer form="ring" color="hotPink" intensity={75} rotation-y={-Math.PI / 2} position={[0, 30, 30]} scale={[100, 2, 1]} />
          <Lightformer form="ring" color="red" intensity={5} scale={5} position={[0, 8, 0]} onUpdate={(self) => self.lookAt(0, 0, 0)} />
        </Environment>
          </>
      )}
      </Suspense>
  )
})

export default BallLandscape
