import { useNavigate } from 'react-router-dom'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import HomePageText from './HomePageText'
import { Center, Text3D } from '@react-three/drei'
import { useCursor } from '@react-three/drei'

const degrees = (d) => d * (Math.PI / 180)

const Platform = ({ endpoint, position, dims, text }) => {
  const platformLight = useRef()
  const platform = useRef()
  const navigate = useNavigate()
  const fadeDir = useRef(0)
  const hasTriggeredRef = useRef(false) 
  const [showButton, setShowButton] = useState(false)
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  const lightMax = 0.5
  const lightMin = 0
  const fieldOpMax = 0.3
  const fieldOpMin = 0

  useFrame(() => {
    if (
      fadeDir.current === 1 &&
      platformLight.current &&
      platform.current &&
      platformLight.current.intensity < lightMax
    ) {
      platformLight.current.intensity = Math.min(platformLight.current.intensity + 0.01, lightMax)
      platform.current.material.opacity = Math.min(platform.current.material.opacity + 0.01, fieldOpMax)
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
      if (platformLight.current.intensity <= lightMin) fadeDir.current = 0
    }
  })

  return (
    <>
    <RigidBody
  type="fixed"
  friction={0}
  colliders={false}
  onCollisionEnter={() => {
      if (!hasTriggeredRef.current) {
          hasTriggeredRef.current = true
          fadeDir.current = 1
          setShowButton(true) // 👉 show the button
        }
    }}
    onCollisionExit={() => {
        fadeDir.current = -1
        hasTriggeredRef.current = false
        setShowButton(false) // 👉 hide the button
    }}
>
  {/* Collider acts as trigger */}
  <CuboidCollider
    args={[dims[0] / 2, dims[1] / 2, dims[2] / 2]}
    position={[position[0], position[1]+1, position[2]]}
    />

  {/* Visuals */}
  <group position={position}>
    <mesh ref={platform}>
      <boxGeometry args={dims} />
      <meshStandardMaterial color="orange" transparent />
    </mesh>

    <HomePageText
      text={text}
      type="static"
      pos={[0, 0.05, 0]}
      rot={[degrees(-90), degrees(0), degrees(0)]}
      col="orange"
      prelit
      />

    <pointLight
      position={[0, 1, 0]}
      ref={platformLight}
      intensity={0}
      color="white"
      />
{showButton && (
    <group>
  <mesh
    position={[0, 5, 0]}
    rotation={[degrees(-45), degrees(-20), degrees(-10)]}
    onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    onClick={() => navigate(endpoint)}
    >
    <Center>
    <Text3D font="/fonts/Fredoka_Regular.json" size={0.3} height={0.1} position={[-0.9, -0.1, 0.55]}>
        See games
    <meshStandardMaterial color="white" metalness={10} roughness={1} />
    </Text3D>
    </Center>
  </mesh>
</group>    
)}
  </group>
</RigidBody>
      </>
  )
}

export default Platform
