import { Canvas } from '@react-three/fiber'
import React from 'react'
import HomePageText from './r3fAssets/HomePageText'
import HomePageLogo from './HomePageLogo'
import Rings from './r3fAssets/Rings'
import { OrbitControls } from '@react-three/drei'


const HomePageCanvas = () => {
    const degrees = (degrees) => degrees * (Math.PI / 180)
  return (
    <div style={{height: '100%'}}>
        <Canvas shadows={true} camera={{ position: [0, 0, 15] }} style={{height: '100%'}}>
            <ambientLight intensity={0.5} />
            <directionalLight intensity={10} position={[1,1,1]} />
            
            <HomePageLogo />

            {/* <OrbitControls enableZoom={true} enablePan={true}/> */}
        </Canvas>
    </div>
  )
}

export default HomePageCanvas
