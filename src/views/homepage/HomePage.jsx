import { Canvas } from '@react-three/fiber'
import { useState, useEffect, useRef} from 'react'
import React from 'react'
import Lighting from './Lighting'
import Backdrop from './Backdrop'
import ThreeLetters from './ThreeLetters'
import GroundPlane from './GroundPlane'
import { useThree } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import NPRobot from './NPRobot'
import useGlobalStore from '../../business/useGlobalStore'
import { PerformanceMonitor } from '@react-three/drei'
import { AdaptiveEvents } from '@react-three/drei'
import { usePerf } from 'r3f-perf'
import { PerfHeadless } from 'r3f-perf'

const PerfHook = () => {
  const perf = usePerf()
  console.log(perf.getReport())
  return <PerfHeadless />
}

const PerfMonitor = ({setIncline, setDecline, incline, decline, setDpr, dpr}) => {
  const maxDpr = 1

  useFrame(() =>{
    if(incline && !decline && dpr < maxDpr){
      setDpr(prev => prev + 0.01)
    }

    if(decline && !incline && dpr > 0){
      setDpr(prev => prev -0.01)
    }
  })


  return <PerformanceMonitor onIncline={() => setIncline(true)} onDecline={() => setDecline(true)} />

}

const FadeIn = ({canvasRef, assetsReady}) => {

    const [start, setStart] = useState(false)

    useEffect(() =>{
      if(assetsReady){
        setTimeout(() => {
          setStart(true)
        }, 500);
      }      
    }, [assetsReady])

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

const StaticCamera = ({ initialAnimation, setInitialAnimation, allAssetsReady, animate }) => { 
    const { camera } = useThree()
    const [start, setStart] = useState(false)
    const [startPosition, setStartPosition] = useState([0,3,50])
    const [targetPosition, setTargetPosition] = useState([-3, 7, -6])
    const [lookAt, setLookAt] = useState([2, 2, 9])

    const screen = useGlobalStore((state) => state.screen)

    useEffect(() => {
      console.log(screen)
    }, [screen])
   
    useEffect(() =>{
     
      switch(screen){
        case 'xs':  setTargetPosition([0, 6, -4])
                    setLookAt([1.6, 2, 9])
        break
        case 'sm':  setTargetPosition([0, 5.5, 0])
                    setLookAt([1.6, 2, 9])
        break
        case 'md':  setTargetPosition([-3, 5, 0])
                    setLookAt([1.6, 2, 9])
        break
        case 'lg':  setTargetPosition([-1, 5, 0])
                    setLookAt([1.6, 2, 9])
        break
      }
     
   }, [screen])

    useEffect(() => {
      if(animate && start){
        camera.position.set(...startPosition)
      } else {
        camera.position.set(...targetPosition)
        camera.lookAt(new THREE.Vector3(...lookAt))
      }
    }, [startPosition, camera, animate])
  
    // Animate camera toward target each frame
    useFrame(() => {
      if(allAssetsReady && !start){setStart(true)}
      if(targetPosition){
        camera.position.lerp(new THREE.Vector3(...targetPosition), 0.009)
        camera.lookAt(new THREE.Vector3(...lookAt))
      }
      if(camera.position.x < -2.98 && !initialAnimation){
        setInitialAnimation(true)
      }
    }, [targetPosition, screen])
  
    return null
  }

const HomePage = ({showBot = true}) => {
    const degrees = useGlobalStore((state) => state.degrees)
    const canvasRef = useRef()
    const animate = useGlobalStore((state) => state.animate)
    const setAnimate = useGlobalStore((state) => state.setAnimate)
    const [initialAnimation, setInitialAnimation] = useState(false)
    const [groundReady, setGroundReady] = useState(false)
    const [lightingReady, setLightingReady] = useState(false)
    const [backdropReady, setBackdropReady] = useState(false)
    const [lettersReady, setLettersReady] = useState(false)
    const [dpr, setDpr] = useState(0.5)
    const [incline, setIncline] = useState(false)
    const [decline, setDecline] = useState(false)
    const allAssetsReady = groundReady && lettersReady
    

    useEffect(() =>{
      if(initialAnimation){
        setAnimate(false)
      } else {
        setAnimate(true)
      }
    },[initialAnimation])

    useEffect(() => {
      // console.log(incline, decline)
      // console.log(dpr)
    }, [incline, decline, dpr])


    useEffect(() =>{
    }, [groundReady, backdropReady, lettersReady, lightingReady, allAssetsReady])

    return (
    <div style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', background: 'black'}}>
  
        <Canvas ref={canvasRef} className='canvas' gl={{ physicallyCorrectLights: true }} shadows dpr={dpr}>

          {/* <PerfHook /> */}
        <AdaptiveEvents />
        <PerfMonitor setDecline={setDecline} setIncline={setIncline} incline={incline} decline={decline} setDpr={setDpr} dpr={dpr}/>

          <Backdrop blur={0} int={0.06} backRot={[degrees(0), degrees(-250), degrees(0)]} envRot={[0, degrees(0), 0]} res={720} setBackdropReady={setBackdropReady}/>
          <ThreeLetters setLettersReady={setLettersReady}/>
          <GroundPlane setGroundReady={setGroundReady}/>
  
          <FadeIn canvasRef={canvasRef} assetsReady={allAssetsReady}/>
          <StaticCamera animate={animate} allAssetsReady={allAssetsReady} initialAnimation={initialAnimation} setInitialAnimation={setInitialAnimation}/>  
          {showBot && <NPRobot pos={[1.5,0.5,5]} rot={[degrees(0), degrees(180), degrees(0)]}/>}

      </Canvas>
            
    </div>
    )
};

export default HomePage;