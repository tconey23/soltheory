import { useEffect, useState, useRef } from 'react'
import { Text3D, Center } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import { SpotLight } from '@react-three/drei'
import { SpotLightHelper } from 'three'
import { useHelper } from '@react-three/drei'

const degrees = (degrees) => degrees * (Math.PI / 180)

const Character = ({ch, x, thickness, col}) => {
  const [fontSize, setFontSize] = useState(2)
  const [font, setFont] = useState("/fonts/Fredoka_Regular.json")

  return (
      <RigidBody 
        colliders="cuboid" 
        restitution={0.2}
        friction={1}
        mass={-10}
        angularDamping={0.1}
        linearDamping={0.1}
        >
      <mesh castShadow receiveShadow>
      <Text3D
        position={[x,0,0]}
        font={font}
        size={1}
        height={thickness}   // Extrusion depth
        curveSegments={64}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={8}
        castShadow
        >
    {ch}
  <meshStandardMaterial attach="material" color={col} metalness={10} roughness={0.5} transparent={true} opacity={0.9} castShadow/>
  </Text3D>
  </mesh>
  </RigidBody>
  )
}

const HomePageText = ({text, thickness, type, pos, rot, col, prelit, charOffset}) => {

  const spotlightRef = useRef()
  const targetRef = useRef()

  // useHelper(spotlightRef, SpotLightHelper, 'teal')
    
    const [fontSize, setFontSize] = useState(2)
    const [font, setFont] = useState("/fonts/Fredoka_Regular.json")
    
    const [renderedObjects, setRenderedObjects] = useState([])

    useEffect(() => {
      let t = text.replaceAll(" ", "").split('')
      setRenderedObjects(
        t.map((c, i) => {
          let offset = 0
          if(charOffset && !isNaN(i+charOffset)){
            offset = i*charOffset
          } else {
            offset = i
          }
        return (
          <Character ch={c} x={offset} thickness={thickness} charOffset={charOffset} col={col}/>
        )})
      )
    }, [])    

  return (
    <>
      {type === 'dynamic' && renderedObjects}
      {type === 'static' && 
      <group position={pos}>
        {prelit && (
          <SpotLight
            ref={spotlightRef}
            position={[0, 0.3, -2]}
            angle={degrees(180)}
            penumbra={0.8}
            intensity={2}
            distance={3}
            castShadow
            target={targetRef.current}
          />
        )}
        <mesh castShadow receiveShadow rotation={rot} ref={targetRef}>
          <Center>
            <Text3D
              font={font}
              size={1}
              height={thickness}
              curveSegments={64}
              bevelEnabled
              bevelThickness={0.02}
              bevelSize={0.02}
              bevelOffset={0}
              bevelSegments={8}
              castShadow
            >
              {text}
            <meshStandardMaterial
              attach="material"
              color={col}
              metalness={1}
              roughness={0.5}
              transparent
              opacity={1}
            />
            </Text3D>
          </Center>
        </mesh>
      </group>
      }
    </>
  )
}

export default HomePageText
