import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useState, useRef } from 'react'
import { Physics } from '@react-three/rapier'
import React from 'react'
import HomePageText from './r3fAssets/HomePageText'
import { useMediaQuery } from '@mui/material'
import BallLandscape from './r3fAssets/BallLandscape'
import JoystickWrapper from './r3fAssets/Joystick'
import { Stack } from '@mui/system'


const HomePageCanvas = () => {
  const degrees = (degrees) => degrees * (Math.PI / 180)
  const isMobile = useMediaQuery("(max-width:430px)");
  const [joystickData, setJoystickData] = useState(null)

  const handleJoystickMove = (data) => {
    console.log('move')
    setJoystickData({
      angle: data.angle,
      force: data.force,
    })
  }
  
  const handleJoystickEnd = () => {
    console.log('end')
    setJoystickData({
      angle: 0,
      force: 0,
    })
  }
  
  return (
  <div style={{height: '100%', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
      <Canvas shadows style={{height: '100%', background: 'black'}}>
          {/* <OrbitControls enableZoom={true} enablePan={true}/> */}
          <directionalLight intensity={0.05}/>
          <Physics iterations={10} gravity={[0, -9.81, 0]}>
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
