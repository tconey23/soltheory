import { useState } from 'react'
import { Text3D, Center } from '@react-three/drei'

const HomePageText = () => {
    const degrees = (degrees) => degrees * (Math.PI / 180)
    const [fontSize, setFontSize] = useState(2)
    const [font, setFont] = useState("/fonts/Fredoka_Regular.json")

    

  return (
    <Center receiveShadow rotation={[degrees(-90),0,0]}>
        <Text3D
            position={[5.2,-0.5,0]}
            font={font}
            size={0.4}
            height={0.2}   // Extrusion depth
            curveSegments={32}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={8}
            >
        ®
        <meshStandardMaterial attach="material" color="silver" metalness={3} roughness={10} />
        </Text3D>
        <Text3D
            font={font}
            size={fontSize}
            height={0.2}   // Extrusion depth
            curveSegments={32}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={8}
            >
        SOL
        <meshStandardMaterial attach="material" color="silver" metalness={3} roughness={10} />
        </Text3D>
        <Text3D
            position={[3.8,-0.5,0]}
            font={font}
            size={fontSize * 0.15}
            height={0.2}   // Extrusion depth
            curveSegments={32}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={8}
            >
        theory
        <meshStandardMaterial attach="material" color="silver" metalness={3} roughness={2} />
        </Text3D>
      </Center>
  )
}

export default HomePageText
