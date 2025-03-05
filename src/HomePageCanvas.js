import { Canvas } from '@react-three/fiber'
import React from 'react'
import HomePageText from './r3fAssets/HomePageText'
import HomePageLogo from './HomePageLogo'
import Rings from './r3fAssets/Rings'
import { OrbitControls } from '@react-three/drei'
import { MeshReflectorMaterial } from "@react-three/drei";


const HomePageCanvas = () => {
    const degrees = (degrees) => degrees * (Math.PI / 180)

  return (
    <div style={{height: '100%'}}>
        <Canvas shadows={true} camera={{ position: [0, 0, 15] }} style={{height: '100%'}}>
            <ambientLight intensity={0.5} />
            <directionalLight color={'green'} intensity={10} position={[2,0,1]} />
            <directionalLight color={'blue'} intensity={10} position={[1,2,1]} />
            <directionalLight color={'red'} intensity={10} position={[1,3,1]} />

            <directionalLight intensity={40} position={[1,0,1]} />
              <mesh position={[0,-7,0]} rotation={[degrees(-50),degrees(0),degrees(0)]}>
                <planeGeometry args={[500,500,500]} />
                  <MeshReflectorMaterial
                    color='black'
                    blur={[0, 0]} 
                    mixBlur={0} 
                    mixStrength={2} 
                    mixContrast={2} 
                    resolution={1080} 
                    mirror={1} 
                    depthScale={0.5}
                    minDepthThreshold={0.9}
                    maxDepthThreshold={1} 
                    depthToBlurRatioBias={0.25} 
                    reflectorOffset={0}
                  />
              </mesh>
            
            <HomePageLogo />

            <OrbitControls enableZoom={true} enablePan={true}/>
        </Canvas>
    </div>
  )
}

export default HomePageCanvas
