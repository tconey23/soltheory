import { Canvas } from '@react-three/fiber'
import React from 'react'
import HomePageText from './r3fAssets/HomePageText'
import HomePageLogo from './HomePageLogo'
import Rings from './r3fAssets/Rings'
import { OrbitControls } from '@react-three/drei'
import { MeshReflectorMaterial } from "@react-three/drei";
import { useFrame } from '@react-three/fiber'
import { useState, useRef } from 'react'
import { useMediaQuery } from '@mui/material'
import HeadModel from './components/HeadModel'


const purple = '#c956ff'
const yellow = '#fff200'
const green = '#45d500'


const Lighting = () => {
  const light1 = useRef();
  const light2 = useRef();
  const light3 = useRef();
  
  // Store intensity direction for each light
  const [lightDirections, setLightDirections] = useState({
    light1: 1, // 1 = increasing, -1 = decreasing
    light2: 1,
    light3: 1,
  });
  
  useFrame(() => {
    if (light1.current && light2.current && light3.current) {
      setLightDirections((prevDirections) => {
        // Function to update intensity for a single light
        const updateLight = (light, key) => {
          if (!light) return prevDirections[key];
          
          if (light.intensity >= 20) {
            return -1; // Switch to decreasing
          } else if (light.intensity <= 0) {
            return 1; // Switch to increasing
          }
          return prevDirections[key];
        };
        
        // Update directions
        return {
          light1: updateLight(light1.current, "light1"),
          light2: updateLight(light2.current, "light2"),
          light3: updateLight(light3.current, "light3"),
        };
      });
      
      light1.current.intensity += lightDirections.light1 * 0.001;
      light2.current.intensity += lightDirections.light2 * 0.003;
      light3.current.intensity += lightDirections.light3 * 0.007;
    }
  });
  
  return (
    <>
      <directionalLight ref={light1} intensity={10} color={green} position={[2,0,1]} />
      <directionalLight ref={light2} intensity={20} color={'red'} position={[1,2,1]} />
      <directionalLight ref={light3} intensity={15} color={purple} position={[1,3,1]} />
    </>
  );
};


const HomePageCanvas = () => {
  const degrees = (degrees) => degrees * (Math.PI / 180)
  const isMobile = useMediaQuery("(max-width:430px)");
  
  return (
    <div style={{height: '100%', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
        <Canvas shadows={true} camera={{ position: [0, 0, 15], fov: isMobile ? 80 : 70 }} style={{height: '100%', background: 'black'}}>
            <ambientLight intensity={0.5} position={[0,0,0]}/>
            <Lighting />

            {/* <directionalLight intensity={40} position={[1,0,1]} />
            <directionalLight intensity={40} position={[-1,0,-1]} /> */}

              {/* <mesh position={[0,-7,0]} rotation={[degrees(-50),degrees(0),degrees(0)]}>
                <planeGeometry args={[1000,1000,500]} />
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
              </mesh> */}
            
            <HomePageLogo />
            {/* <HeadModel scale={0.04} position={[0,0,-5]}/> */}
            <OrbitControls enableZoom={true} enablePan={true}/>
        </Canvas>
    </div>
  )
}

export default HomePageCanvas
