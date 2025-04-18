import { Text3D, Center } from '@react-three/drei'
import { useGlobalContext } from '../business/GlobalContext'
import { RigidBody } from '@react-three/rapier'
import { useMemo, useState } from 'react'

const ThreeText = ({ text = "Hello", size = 1, height = 0.5, physics = false, spacing }) => {
  const [font] = useState("/fonts/Fredoka_Regular.json")
  const { degrees } = useGlobalContext()

  const physicsLetters = useMemo(() => (
    text.split('').map((l, i) => (
        <RigidBody
        type="dynamic"
        colliders="cuboid"
        enabledRotations={[false, false, false]}
      >
      <Text3D
        castShadow
        key={i}
        position={[i * (size * spacing), 0, 0]} // adjust spacing based on size
        font={font}
        size={size}
        height={height}
        bevelEnabled
        bevelSize={0.02}
        bevelThickness={0.02}
        curveSegments={12}
        >
        {l}
        <meshStandardMaterial color="white" />
      </Text3D>
    </RigidBody>
    ))
  ), [text, font, size, height])

  const letters = useMemo(() => (
    text.split('').map((l, i) => (
      <Text3D
        castShadow
        key={i}
        position={[i * (size * spacing), 0, 0]} // adjust spacing based on size
        font={font}
        size={size}
        height={height}
        bevelEnabled
        bevelSize={0.02}
        bevelThickness={0.02}
        curveSegments={12}
        >
        {l}
        <meshStandardMaterial color="white" />
      </Text3D>
    ))
  ), [text, font, size, height])

  return (
    <Center rotation={[degrees(0), degrees(180), degrees(0)]}>
      {physics ? (
          <group>{physicsLetters}</group>
      ) : (
        <group>{letters}</group>
      )}
    </Center>
  )
}

export default ThreeText
