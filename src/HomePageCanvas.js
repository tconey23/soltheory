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
import BallLandscape from './r3fAssets/BallLandscape'
import { Physics, RigidBody } from '@react-three/rapier'


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
        <Canvas shadows style={{height: '100%', background: 'black'}}>
            <OrbitControls enableZoom={true} enablePan={true}/>
            <Physics gravity={[0, -9.81, 0]}>
              <BallLandscape />
            </Physics>

        </Canvas>
    </div>
  )
}

export default HomePageCanvas
