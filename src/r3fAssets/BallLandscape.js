// File: src/scenes/BallLandscapeOptimized.js
import { memo, Suspense, useEffect, useRef } from 'react'
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
  const textures = useTexture({
    map: '/ground_texture/BaseColor.jpg',
    aoMap: '/ground_texture/AmbientOcclusion.jpg',
    displacementMap: '/ground_texture/Displacement.png',
    metalnessMap: '/ground_texture/Metallic.png',
    normalMap: '/ground_texture/Normal.png',
    roughnessMap: '/ground_texture/Roughness.png',
  })

  useEffect(() => {
    Object.values(textures).forEach((tex) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping
      tex.repeat.set(300, 300)
      tex.anisotropy = 16
    })
  }, [textures])

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

      <RigidBody type="fixed" colliders="cuboid" collisionGroups={interactionGroups([3], [0, 1, 2])}>
        <mesh receiveShadow position={[0, -1, 0]}>
          <boxGeometry args={[30, 1, 30]} />
          <meshStandardMaterial {...textures} metalness={1.5} roughness={1.1} />
        </mesh>
        <CuboidCollider args={[30, 1, 30]} position={[0, -1, 0]} />
      </RigidBody>

      {/* Text groups */}
      <group>
        <group scale={6} position={[-8, 2, -5]}>
          <HomePageText text={'SOL'} thickness={0.4} type={'dynamic'} pos={[-1.5, 1, -5]} />
        </group>
        <group scale={3} position={[-8, 3, -2]}>
          <HomePageText text={'Theory'} thickness={0.4} type={'dynamic'} pos={[-1.8, 1, -3]} />
        </group>
      </group>

      {/* Conditional Robot & Camera */}
      {showRobot && (
        <>
          <RobotModel bodyRef={ballRef} joystick={joystickData} setTurnAround={setTurnAround} turnAround={turnAround} />
          <CameraFollow turnAround={turnAround} setTurnAround={setTurnAround} targetRef={ballRef} offset={new THREE.Vector3(-2, 5, 5)} />
        </>
      )}

      {/* {showPlatforms && (
        <group>
          <Platform position={[0, -0.12, -30]} fieldDims={[4.8, 5, 4.8]} dims={[5, 0.08, 5]} bevelRadius={0.1} bevelSmoothness={8} text={'Games'} endpoint={'/games'} clickText={'See Games'} triggerObject={'robot-mesh'} />
          <Platform position={[20, -0.1, -30]} fieldDims={[4.8, 5, 4.8]} dims={[5, 0.08, 5]} bevelRadius={0.1} bevelSmoothness={8} text={'ESC'} endpoint={'/esc'} clickText={'See ESCs'} triggerObject={'robot-mesh'} />
        </group>
      )} */}

      {/* Environment */}
      {showEnvironment && (
        <Environment
        resolution={720}
        preset={null}
        background
        backgroundBlurriness={0}
        backgroundIntensity={0.1}
        backgroundRotation={[degrees(0), degrees(-180), degrees(0)]}
        environmentIntensity={0.2}
        environmentRotation={[0, degrees(0), 0]}
        files={'/puresky.hdr'}
        >
          <Lightformer form="ring" color="rebeccapurple" intensity={900} rotation-x={Math.PI / 2} position={[0, 10, 0]} scale={[10, 1, 1]} />
          <Lightformer form="ring" color="limeGreen" intensity={100} rotation-z={degrees(45)} position={[0, 10, 0]} scale={[9, 1, 1]} />
          <Lightformer form="ring" color="deepSkyBlue" intensity={80} rotation-z={degrees(-90)} position={[5, 10, 0]} scale={[10, 1, 1]} />
          <Lightformer form="ring" color="hotPink" intensity={300} rotation-y={-Math.PI / 2} position={[0, 30, 30]} scale={[100, 2, 1]} />
          <Lightformer form="ring" color="red" intensity={10} scale={5} position={[0, 8, 0]} onUpdate={(self) => self.lookAt(0, 0, 0)} />
        </Environment>
      )}
      </Suspense>
  )
})

export default BallLandscape
