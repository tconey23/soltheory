import React, { useRef } from 'react'
import { RigidBody, useImpulseJoint } from '@react-three/rapier'
import { Center, Text3D } from '@react-three/drei'
import { BoxGeometry } from 'three'

const HangingText = ({char, pos}) => {
  const anchor = useRef()
  const letter = useRef()

  useImpulseJoint(anchor, letter, [
    [0, -0.025, 0],   // Anchor on anchor
    [0, 1, 0],     // Anchor on letter
    0.5                 // Max length
  ])

  return (
    <group position={pos}>
      <RigidBody
        ref={anchor}
        type="fixed"
        position={[0, 2, 0]}
        restitution={0}
        enabledRotations={[false, false, false]}

        colliders={false}
      >
        <mesh>
          <sphereGeometry args={[0.01, 16, 16]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </RigidBody>

      <RigidBody
        ref={letter}
        type="dynamic"
        colliders="cuboid"
        position={[0, 48.5, 0]} // Place beneath anchor
        enabledRotations={[true, false, true]}
        linearDamping={1}
        angularDamping={1}
      >
        <mesh>
            <boxGeometry args={[0.95,1.5,0.05]} />
            <meshStandardMaterial color={'black'}/>
        <Center>
        <Text3D
          font="/fonts/Fredoka_Regular.json"
          size={1}
          height={0.1}
          curveSegments={64}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={8}
          position={[-0.5, 0, 0]} // shift left to visually center the 'S'
          >
          <meshStandardMaterial color="gold" />
          {char}
        </Text3D>
        </Center>
        </mesh>
      </RigidBody>
    </group>
  )
}

export default HangingText
