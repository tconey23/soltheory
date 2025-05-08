import { useState, useEffect, useRef} from 'react'
import React from 'react'
import { Center, Outlines, Text3D } from '@react-three/drei'
import { useFont } from '@react-three/drei'
import { useIntersect } from '@react-three/drei'

const ThreeLetters = ({setLettersReady}) => {
  const degrees = (degrees) => degrees * (Math.PI / 180);
    const font = useFont('/fonts/Fredoka_Regular.json')
    const [readyCount, setReadyCount] = useState(0)

    const meshRef = useIntersect((visible) => {
      if(visible){
        setReadyCount(prev => prev +1 )
      }})

    const meshRef2 = useIntersect((visible) => {
      if(visible){
        setReadyCount(prev => prev +1 )
      }})

    useEffect(() => {
      if(readyCount == 2){
        setLettersReady(true)
      }
    }, [readyCount])

  
    return (
      <>
      <group position={[2.5,4,14]} rotation={[degrees(0), degrees(180), degrees(0)]}>
              <Center>
                <Text3D
                        castShadow
                        position={[0, 1, 0]}
                        font={'/fonts/Fredoka_Regular.json'}
                        size={4}
                        height={0.1}
                        bevelEnabled
                        bevelSize={0.02}
                        bevelThickness={0.02}
                        curveSegments={12}
                        >
                        SOL
                        <meshStandardMaterial
                          ref={meshRef}
                          color='black'
                          metalness={3}
                          roughness={10}
                          emissive="deepSkyBlue" // <-- needed!
                          emissiveIntensity={0.1}
                          />
                        <Outlines screenspace thickness={0.05} color="deepskyblue"/>
                  </Text3D>
                </Center>
            </group>
            <group position={[2,2,10]} rotation={[degrees(0), degrees(180), degrees(0)]}>
              <Center>
                <Text3D
                        castShadow
                        position={[0, 0, 0]}
                        font={'/fonts/Fredoka_Regular.json'}
                        size={2}
                        height={0.25}
                        bevelEnabled
                        bevelSize={0.02}
                        bevelThickness={0.02}
                        curveSegments={32}
                        >
                        Theory
                          <meshStandardMaterial
                          ref={meshRef2}
                          color='black'
                          metalness={3}
                          roughness={10}
                          emissive="hotpink" // <-- needed!
                          emissiveIntensity={0.1}
                          />
                        <Outlines screenspace thickness={0.05} color="hotpink"/>
                       
                  </Text3D>
                </Center>
            </group>
         </>
    )
};

export default ThreeLetters;