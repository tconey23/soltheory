import { useNavigate } from 'react-router-dom'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import HomePageText from './HomePageText'
import { Center, Html, Text3D } from '@react-three/drei'
import { useCursor } from '@react-three/drei'
import { Billboard } from '@react-three/drei'
import { Button } from '@mui/material'

const degrees = (d) => d * (Math.PI / 180)

const Platform = ({ endpoint, position, dims, text, clickText, triggerObject}) => {
  const platformLight = useRef()
  const platform = useRef()
  const navigate = useNavigate()
  const fadeDir = useRef(0)
  const hasTriggeredRef = useRef(false) 
  const [showButton, setShowButton] = useState(false)
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  // const lightMax = 0.5
  // const lightMin = 0
  // const fieldOpMax = 0.3
  // const fieldOpMin = 1

  // useFrame(() => {
  //   if (
  //     fadeDir.current === 1 &&
  //     platformLight.current &&
  //     platform.current &&
  //     platformLight.current.intensity < lightMax
  //   ) {
  //     platformLight.current.intensity = Math.min(platformLight.current.intensity + 0.01, lightMax)
  //     platform.current.material.opacity = Math.min(platform.current.material.opacity + 0.01, fieldOpMax)
  //     if (platformLight.current.intensity >= lightMax) fadeDir.current = 0
  //   }

  //   if (
  //     fadeDir.current === -1 &&
  //     platformLight.current &&
  //     platform.current &&
  //     platformLight.current.intensity > lightMin
  //   ) {
  //     platformLight.current.intensity = Math.max(platformLight.current.intensity - 0.01, lightMin)
  //     platform.current.material.opacity = Math.max(platform.current.material.opacity - 0.01, fieldOpMin)
  //     if (platformLight.current.intensity <= lightMin) fadeDir.current = 0
  //   }
  // })

  return (
    <>
    <RigidBody
    userData='platform'
  type="fixed"
  friction={0}
  colliders={false}
  onCollisionEnter={({ target, other }) => {
      if (!hasTriggeredRef.current && other.rigidBody.userData === triggerObject) {
          hasTriggeredRef.current = true
          fadeDir.current = 1
          console.log('collision')
          setShowButton(true)
        }
    }}
    onCollisionExit={() => {
        fadeDir.current = -1
        hasTriggeredRef.current = false
        setShowButton(false)
    }}
>
  {/* Collider acts as trigger */}
  <CuboidCollider
    args={[dims[0] / 2, 0.01, dims[2] / 2]}
    position={[position[0], position[1]+0.1, position[2]]}
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

{showButton && (
        <Billboard position={[0,-5,0]} >
            <Html rotation={[degrees(0), degrees(90), degrees(90)]}>
                <Button onClick={() => navigate(endpoint)} variant='contained'>{clickText}</Button>
            </Html>
        </Billboard>   
)}
  </group>
</RigidBody>
      </>
  )
}

export default Platform
