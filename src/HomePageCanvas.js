import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useState, useEffect} from 'react'
import { Physics, TrimeshCollider } from '@react-three/rapier'
import React from 'react'
import { useMediaQuery } from '@mui/material'
import BallLandscape from './r3fAssets/BallLandscape'
import JoystickWrapper from './r3fAssets/Joystick'
import { useMemo } from 'react'
import { useDetectGPU } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { Debug } from '@react-three/rapier'

const degrees = (degrees) => degrees * (Math.PI / 180)

const GroundPlane = () => {
  const curvedPlane = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(100, 100, 100, 100)
    geometry.rotateX(-Math.PI / 2)
  
    // ✅ VERY IMPORTANT: flatten the geometry so Trimesh can use it
    geometry.toNonIndexed()
  
    const pos = geometry.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const y = Math.sin((x ** 2 + z ** 2) * 0.001) * 2
      pos.setY(i, y)
    }
  
    pos.needsUpdate = true
    geometry.computeVertexNormals()

    console.log(geometry.attributes.position.array.length)
  
    return geometry
  }, [])

  const textures = useTexture({
    map: '/ground_texture/BaseColor.png',
    aoMap: '/ground_texture/AmbientOcclusion.jpg',
    displacementMap: '/ground_texture/Displacement.png',
    metalnessMap: '/ground_texture/Metallic.png',
    normalMap: '/ground_texture/Normal.png',
    roughnessMap: '/ground_texture/Roughness.png',
  })

  useEffect(() => {
    Object.values(textures).forEach((tex) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping
      tex.repeat.set(10, 10) // Less dense than 300x300 for better lighting
      tex.anisotropy = 16
    })
  }, [textures])

  return (
    <RigidBody type="fixed" colliders={false}>
      <mesh geometry={curvedPlane} receiveShadow>
        <meshStandardMaterial {...textures} metalness={1} roughness={1.5} />
      </mesh>
      <TrimeshCollider

      position={[0,0.55,0]}
        args={[
          Array.from(curvedPlane.attributes.position.array),
          Array.from(curvedPlane.index?.array ?? []), // must exist, so fallback to []    
        ]}
      />
    </RigidBody>
  )
}


const HomePageCanvas = () => {
  const degrees = (degrees) => degrees * (Math.PI / 180)
  const isMobile = useMediaQuery("(max-width:430px)");
  const [joystickData, setJoystickData] = useState(null)

  const GPUTier = useDetectGPU()

  // console.log(GPUTier)

  const handleJoystickMove = (data) => {
    setJoystickData({
      angle: data.angle,
      force: data.force,
    })
  }
  
  const handleJoystickEnd = () => {
    setJoystickData({
      angle: 0,
      force: 0,
    })
  }
  
  return (
  <div style={{height: '100%', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
      <Canvas gl={{ physicallyCorrectLights: true }} shadows style={{height: '100%', background: 'black'}}>
          <OrbitControls enableZoom={true} enablePan={true}/>
          <Physics gravity={[0, -9.81, 0]}>
            {/* <Debug/> */}
            <GroundPlane />
            <group rotation={[degrees(0), degrees(180), degrees(0)]} >
              <BallLandscape joystickData={joystickData}/> 
            </group>
          </Physics>  
          </Canvas>
          <JoystickWrapper
            size={100}
            baseColor="black"
            stickColor="skyblue"
            move={handleJoystickMove}
            stop={handleJoystickEnd}
          />
  </div>
  )
}

export default HomePageCanvas
