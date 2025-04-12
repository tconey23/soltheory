import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useState, useRef, useEffect } from 'react'
import { Physics } from '@react-three/rapier'
import React from 'react'
import HomePageText from './r3fAssets/HomePageText'
import { useMediaQuery } from '@mui/material'
import BallLandscape from './r3fAssets/BallLandscape'
import JoystickWrapper from './r3fAssets/Joystick'
import { Stack } from '@mui/system'
import { Debug } from '@react-three/rapier'
import { PerspectiveCamera } from '@react-three/drei'
import { useDetectGPU } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

const CamControl = () => {
  const { camera } = useThree()

  useFrame(() => {
      if(camera){
          camera.lookAt(-95, 2, 0)
      }
  })

  return null
}


const HomePageCanvas = () => {
  const degrees = (degrees) => degrees * (Math.PI / 180)
  const isMobile = useMediaQuery("(max-width:430px)");
  const [joystickData, setJoystickData] = useState(null)

  const GPUTier = useDetectGPU()

  // console.log(GPUTier)

  const handleJoystickMove = (data) => {
    setJoystickData({
      angle: data.angle,
      force: data.force,
    })
  }
  
  const handleJoystickEnd = () => {
    setJoystickData({
      angle: 0,
      force: 0,
    })
  }
  
  return (
  <div style={{height: '100%', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
      <Canvas shadows style={{height: '100%', background: 'black'}}>
          <OrbitControls enableZoom={true} enablePan={true}/>
          {/* <directionalLight castShadow intensity={0.05}/>ws */}
          {/* <PerspectiveCamera key={'perspectiveCamera'} makeDefault position={[-100,2.7,6]}/>
          <CamControl key={'camControl'}/> */}
          <Physics gravity={[0, -9.81, 0]}>
            {/* <Debug/> */}
            <BallLandscape joystickData={joystickData}/> 
          </Physics>  
          </Canvas>
          <JoystickWrapper
            size={100}
            baseColor="black"
            stickColor="skyblue"
            move={handleJoystickMove}
            stop={handleJoystickEnd}
          />
  </div>
  )
}

export default HomePageCanvas
