import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useState, useEffect} from 'react'
import { Physics, TrimeshCollider } from '@react-three/rapier'
import React from 'react'
import { useMediaQuery } from '@mui/material'
import BallLandscape from './r3fAssets/BallLandscape'
import JoystickWrapper from './r3fAssets/Joystick'
import { useDetectGPU } from '@react-three/drei'

import { useGlobalContext } from './business/GlobalContext'
import { PerspectiveCamera } from '@react-three/drei'
import CanvasLoading from './r3fAssets/CanvasLoading'

const degrees = (degrees) => degrees * (Math.PI / 180)


const HomePageCanvas = () => {
  const degrees = (degrees) => degrees * (Math.PI / 180)
  const {isMobile} = useGlobalContext()
  const [joystickData, setJoystickData] = useState(null)

  const GPUTier = useDetectGPU()

  // console.log(GPUTier)
  console.log(isMobile)

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
      <Canvas gl={{ physicallyCorrectLights: true }} shadows style={{height: '100%', background: 'black'}}>
          <OrbitControls enableZoom={false} enablePan={false}/>
          <Physics gravity={[0, -20, 0]}>
            {/* <Debug/> */}
            <group rotation={[degrees(0), degrees(180), degrees(0)]} >
              <BallLandscape joystickData={joystickData}/> 
            </group>
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
