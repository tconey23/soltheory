import { Canvas } from '@react-three/fiber'
import { useState, useEffect, useRef} from 'react'
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
import HomePageMenu from '../../ui_elements/HomePageMenu'
import { Button, Modal, Stack } from '@mui/material'
import FadeStack from '../../ui_elements/FadeStack'

const PerfHook = () => {
  const perf = usePerf()
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

const FadeIn = ({ canvasRef, assetsReady }) => {
  const [start, setStart] = useState(false)

  useEffect(() => {
    if (assetsReady && canvasRef.current?.parentElement) {
      setTimeout(() => {
        setStart(true)
      }, 500)
    }
  }, [assetsReady])

  useFrame(() => {
    if (!canvasRef.current?.parentElement) return; // ✅ Bail out early

    const parent = canvasRef.current.parentElement;

    if (start && parent.style) {
      const currentOpacity = parseFloat(parent.style.opacity) || 0
      parent.style.opacity = Math.min(currentOpacity + 0.005, 1).toString()
    } else {
      parent.style.opacity = "0"
    }
  })

  return null
}

const StaticCamera = ({ initialAnimation, setInitialAnimation, allAssetsReady, animate }) => { 
    const { camera } = useThree()
    const [start, setStart] = useState(false)
    const [startPosition, setStartPosition] = useState([0,3,50])
    const [targetPosition, setTargetPosition] = useState([-3, 7, -6])
    const [lookAt, setLookAt] = useState([2, 2, 9])
    

    const screen = useGlobalStore((state) => state.screen)
   
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
    const [menuVisible, toggleMenuVisible] = useState(true)
    const [overlay, setOverlay] = useState(true)
    const allAssetsReady = groundReady && lettersReady
    
       useEffect(() =>{
    setTimeout(() => {
      setOverlay(false)
    }, 3000);
   }, [overlay])

    useEffect(() =>{
      if(initialAnimation){
        setAnimate(false)
      } else {
        setAnimate(true)
      }
    },[initialAnimation])


    useEffect(() =>{
    }, [groundReady, backdropReady, lettersReady, lightingReady, allAssetsReady])

    return (
    <div style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', background: 'black'}}>

          <Stack
            width="100%"
            height="5%"
            zIndex={200}
            justifyContent="center"
            alignItems="center"
            sx={{ flex: '0 0 5%' }}
            marginY={'3px'}
          >
          <Button onClick={() => toggleMenuVisible(prev => !prev)}>Toggle Menu</Button>
        </Stack>

  
        {menuVisible && 
          <Stack
            height="95%"
            width="100%"
            sx={{ flex: 1 }}
            marginTop={1}
          >
            <HomePageMenu />
          </Stack>
        }
        <Stack position={'fixed'} width={'100%'} height={'100%'} zIndex={1}>
          <FadeStack initial={{opacity: 1}} animate={{opacity: 0}} transition={{duration: 1}}>
              <Stack width={'100%'} height={'80%'} bgcolor={'black'} position={'relative'}></Stack>
          </FadeStack>
            <Canvas ref={canvasRef} className='canvas' gl={{ physicallyCorrectLights: true }} shadows dpr={dpr} sx={{position: 'fixed', zIndex: 100000, height: '80%'}}>
              <AdaptiveEvents />
              <PerfMonitor setDecline={setDecline} setIncline={setIncline} incline={incline} decline={decline} setDpr={setDpr} dpr={dpr}/>

              <Backdrop blur={0} int={0.06} backRot={[degrees(0), degrees(-250), degrees(0)]} envRot={[0, degrees(0), 0]} res={720} setBackdropReady={setBackdropReady}/>
              <ThreeLetters setLettersReady={setLettersReady}/>
              <GroundPlane setGroundReady={setGroundReady}/>

              <FadeIn canvasRef={canvasRef} assetsReady={allAssetsReady}/>
              <StaticCamera animate={animate} allAssetsReady={allAssetsReady} initialAnimation={initialAnimation} setInitialAnimation={setInitialAnimation}/>  
              {showBot && <NPRobot pos={[1.5,0.5,5]} rot={[degrees(0), degrees(180), degrees(0)]}/>}
            </Canvas>
        </Stack>
            
    </div>
    )
};

export default HomePage;