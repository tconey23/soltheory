import { Canvas } from '@react-three/fiber'
import { useState, useEffect, useRef} from 'react'
import { Physics } from '@react-three/rapier'
import React from 'react'
import JoystickWrapper from './Joystick'
import { useGlobalContext } from '../business/GlobalContext'
import Landscape from './Landscape'
import Lighting from './Lighting'
import Backdrop from './Backdrop'
import { Html, Preload } from '@react-three/drei'
import Assets from './Assets'
import { Suspense } from 'react'
import { Loader } from '@react-three/drei'
import ThreeText from './ThreeText'
import { Debug } from '@react-three/rapier'
import { PerformanceMonitor } from '@react-three/drei'
import { ScreenSpace } from '@react-three/drei'
import Portal from './Portal'

const HomePageCanvas = () => {
  const {isMobile, degrees} = useGlobalContext()
  const [joystickData, setJoystickData] = useState(null)
  const [robot] = useState(true)
  const [level, setLevel] = useState(1)

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

      <Canvas gl={{ physicallyCorrectLights: true }} shadows style={{ height: '100%', width: '100%', background: 'black' }}>
        <PerformanceMonitor onIncline={console.log('incline')} onDecline={console.log('decline')}/>
        <Preload all />
        
        <Lighting pos={[0, 40, 0]} xOffset={10} zOffset={-5} intensity={4} color1={'pink'} color2={'deepSkyBlue'} />
        <Backdrop blur={0} int={0.02} backRot={[degrees(0), degrees(-250), degrees(0)]} envRot={[0, degrees(0), 0]} res={720}/>

        <Physics gravity={[0, -20, 0]}>


          {/* <Debug /> */}
          <Suspense fallback={
            <Html>
              <Loader />
            </Html>
            }>
            <Assets
              robot={robot}
              camera={robot}
              joystickData={joystickData}
              />
            <Landscape joystickData={joystickData} />

            {level == 1 && 
            <>
              <group position={[2,5,5]}>
                <group position={[0,5,10]} >
                  <ThreeText height={1} size={6} text={'SOL'} physics={true} spacing={1}/>
                </group>

                <group position={[-3,3,4]} >
                  <ThreeText height={1} size={2} text={'Theory'} physics={true} spacing={1.1}/>
                </group>
              </group>
            </>
            }

          </Suspense>
        </Physics>
    
    </Canvas>
         
    {isMobile && 
      <JoystickWrapper
        size={100}
        baseColor="black"
        stickColor="skyblue"
        move={handleJoystickMove}
        stop={handleJoystickEnd}
      />
    }
          
  </div>
  )
}

export default HomePageCanvas
