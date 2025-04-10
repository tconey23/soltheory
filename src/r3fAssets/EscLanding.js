import { Canvas } from '@react-three/fiber'
import { OrbitControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei'
import { useState, useRef, useEffect, useMemo, Suspense } from 'react'
import { Physics } from '@react-three/rapier'
import ESCLandscape from './ESCLandscape';
import { useFrame } from '@react-three/fiber'
import { useThree } from '@react-three/fiber'
import { Sky } from '@react-three/drei';
import { useGLTF } from '@react-three/drei';
import StuffedBear from './StuffedBear';
import SquareBear from './SquareBear';
import CanvasLoading from './CanvasLoading';

const degrees = (degrees) => degrees * (Math.PI / 180)

const AssetLoader = ({comp, name}) => {

  const [asset, setAsset] = useState()

  useEffect(() => {
    if(comp && name){
      setAsset(comp)
    }
  }, [comp, name])

  return(
    <group userData={name}>
      {asset && asset}
    </group>
  )
}

export const useModelAfterPreload = (path, setState, key) => {
  const gltf = useGLTF(path)

  useEffect(() => {
    if (gltf?.scene && setState && key) {
      setState(gltf.scene.clone())
    }
  }, [gltf, setState, key])
}

const EscSky = () => {

    const x = useRef(-20)
    const z = useRef(-100)

    const [sunPos, setSunPos] = useState([-20, -5, -20])

    const maxX = 1
    const maxZ = 1
    const maxRay = 5
  
    useFrame(() => {
      if (x.current < maxX) {
        x.current += 0.05
      }

      if (z.current < maxZ) {
        z.current += 0.5
      }



    setSunPos([x.current, 1, z.current])
    })
  
    return (
    <group>
      <Sky
        sunPosition={[sunPos[0], sunPos[1], sunPos[1]]}
        turbidity={100}
        rayleigh={4}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
        />
    </group>
    )
  }

const CamControl = ({setCamReady}) => {
    const { camera } = useThree()
  
    useEffect(() => {
        if(camera){
            setCamReady(true)
            camera.position.set(0,4,10)
            camera.lookAt(0, 2, -10)
        }
    }, [camera])
  
    return null
  }

  

const EscLanding = () => {

    const [camReady, setCamReady] = useState(false)
    const sunMesh = useRef()
    const [sunReady, setSunReady] = useState(false)
    const [effectsReady, setEffectsReady] = useState(false)
    const [stuffedBear, setStuffedBear] = useState()
    const [squareBear, setSquareBear] = useState()
    const [assetsReady, setAssetsReady] = useState(false)
    const [progress, setProgress] = useState(0)
    const [models, setModels] = useState({
      StuffedBear: null, 
      SquareBear: null,
      ambientLight: null,
      perspectiveCamera: null,
      camControl: null,
      escSky: null,
      escLandscape: null
    })

    const assetDefinitions = {
      ambientLight: () => <ambientLight castShadow intensity={0.1} />,
      camControl: () => <CamControl setCamReady={setCamReady} />,
      escSky: () => <EscSky />,
      perspectiveCamera: () => <PerspectiveCamera makeDefault position={[0, 2.7, 6]} />,
      escLandscape: (models) => <ESCLandscape sunMesh={sunMesh} models={models} />,
    }

    const [assetList, setAssetList] = useState([
      <ambientLight key={'ambientLight'} castShadows intensity={0.1}/>,
      <PerspectiveCamera key={'perspectiveCamera'} makeDefault position={[0,2.7,6]}/>,
      <CamControl key={'camControl'} setCamReady={setCamReady}/>,
      <EscSky key={'escSky'} />,
      <ESCLandscape key={'escLandscape'} sunMesh={sunMesh} models={models}/>
    ])

    useModelAfterPreload('/squareBear.glb', setSquareBear, 'SquareBear')
    useModelAfterPreload('/freddyTeddy.glb', setStuffedBear, 'StuffedBear')


    const getAsset = (comp, name) => {
      let object

      console.log(squareBear)

      if(name === 'escLandscape'){
        object = <AssetLoader comp={comp} name={name} models={models}/>
      } else {
        object = <AssetLoader comp={comp} name={name}/>
      }

      return object
    }

    useEffect(() => {
      if(progress > 99){
        setProgress(100)
      } else {
        setTimeout(() => {
          setProgress(prev => prev + 2)
        }, 100);
      }

      if(progress == 100){
        setTimeout(() => {
          setAssetsReady(true)
        }, 2000);
      }

    }, [progress])

    useEffect(() =>{
      const array = Object.values(models)
      const findNull = array.filter((m) => m == null)
      if(findNull.length == 0){
        setProgress(51)
      } else {
        setAssetsReady(false)
      }
    }, [models])

    const updateModels = (key, create) => {
      setTimeout(() => {
        setProgress(prev => prev + 10)
        return setModels(prev => ({
          ...prev,
          [key]: <AssetLoader key={key} name={key} comp={create(models)} />
        }))
      }, 1000);
    }

    useEffect(() =>{
      if(models.SquareBear && models.StuffedBear){
        {Object.entries(assetDefinitions).map(([key, create]) => {
          if(!models[key]){
            updateModels(key, create)
          }
          })}
      }
    }, [assetDefinitions])


    useEffect(() => {
      if(stuffedBear){
        setModels(prev => ({
          ...prev,
          StuffedBear: stuffedBear
        })
        )
      }
      if(squareBear){
        setModels(prev => ({
          ...prev,
          SquareBear: squareBear
        })
        )
      }
    }, [stuffedBear, squareBear])


    useEffect(() => {
        if (!effectsReady && camReady && sunMesh.current) {
            // console.log('reqAnim')
          const id = requestAnimationFrame(() => {
            setEffectsReady(true)
          })
          return () => cancelAnimationFrame(id)
        }
      }, [camReady, effectsReady])

  return (
    <div style={{height: '100%', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
    <Canvas shadows style={{height: '100%', background: 'black'}}>
      {assetsReady 
        ?
        <>
        {/* <OrbitControls enableZoom={true} enablePan={true}/> */}
        {models.perspectiveCamera && models.perspectiveCamera}
        {models.camControl && models.camControl}
        {models.ambientLight && models.ambientLight}
        {models.escSky && models.escSky}
        <Physics
        gravity={[0, -9.81, 0]}
        // debug
        >
          {models.escLandscape && models.SquareBear && models.StuffedBear && models.escLandscape}
        </Physics>
        </>
        :
        <CanvasLoading progress={progress}/> 
      }
    </Canvas>
</div>
  );
};

export default EscLanding;