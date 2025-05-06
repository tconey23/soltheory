import { Canvas } from '@react-three/fiber'
import { useState, useEffect, useRef} from 'react'
import React from 'react'
import { useGlobalContext } from '../../business/GlobalContext'
import Lighting from './Lighting'
import Backdrop from './Backdrop'
import ThreeLetters from './ThreeLetters'
import GroundPlane from './GroundPlane'
import { useThree } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import NPRobot from './NPRobot'
import useGlobalStore from '../../business/useGlobalStore'

const FadeIn = ({canvasRef}) => {

    const [start, setStart] = useState(false)

    setTimeout(() => {
        setStart(true)
    }, 2000);

    useFrame(() => {
        if (start && canvasRef.current?.parentElement?.style) {
          let currentOpacity = parseFloat(canvasRef.current.parentElement.style.opacity) || 0;
          canvasRef.current.parentElement.style.opacity = Math.min(currentOpacity + 0.005, 1).toString();
        } else {
            canvasRef.current.parentElement.style.opacity = 0
        }
      });

    return null
}

const StaticCamera = ({ animate, startPosition=[0,3,50], targetPosition = [-3, 10, -6], lookAt = [2, 5, 9] }) => { 
    const { camera } = useThree()
  
    // Set the starting position once
    useEffect(() => {
      if(animate){
        camera.position.set(...startPosition)
      } else {
        camera.position.set(...targetPosition)
        camera.lookAt(new THREE.Vector3(...lookAt))
      }
    }, [startPosition, camera, animate])
  
    // Animate camera toward target each frame
    useFrame(() => {
      if(animate){
        camera.position.lerp(new THREE.Vector3(...targetPosition), 0.009)
        camera.lookAt(new THREE.Vector3(...lookAt))
      }
    })
  
    return null
  }

const HomePage = ({showBot = true, animate = true}) => {
    const degrees = useGlobalStore((state) => state.degrees)
    const canvasRef = useRef()
  
    
    return (
    <div style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', background: 'black'}}>
  
        <Canvas ref={canvasRef} className='canvas' gl={{ physicallyCorrectLights: true }} shadows>
          <FadeIn canvasRef={canvasRef}/>
          
          <Lighting pos={[0, 40, 0]} xOffset={10} zOffset={-5} intensity={8} color1={'pink'} color2={'deepSkyBlue'} />
          <Backdrop blur={0} int={0.06} backRot={[degrees(0), degrees(-250), degrees(0)]} envRot={[0, degrees(0), 0]} res={720}/>
  
            <StaticCamera animate={animate}/>
            <GroundPlane physics={false} />
            
            {showBot && <NPRobot pos={[1.5,0.5,5]} rot={[degrees(0), degrees(0), degrees(0)]}/>}
            
            <ThreeLetters />
      
      </Canvas>
            
    </div>
    )
};

export default HomePage;