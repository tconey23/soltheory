import { RigidBody, useRapier } from '@react-three/rapier'
import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Sparkles, useTexture } from '@react-three/drei'
import RobotModel from './RobotModel'
import * as THREE from 'three'
import SquareBear from './SquareBear';
import StuffedBear from './StuffedBear'
import { SpotLight } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useNavigate } from 'react-router-dom'
import { Center, Text3D } from '@react-three/drei'
import { useGlobalContext } from '../business/GlobalContext'

const degrees = (degrees) => degrees * (Math.PI / 180)

const ESCLandscape = ({sunMesh, models}) => {
    const sun = useRef()
    const { scene: r3fScene } = useThree()
    const model = useRef()
    const spotlightRef = useRef()
    const planeRef = useRef()
    const [groundReady, setGroundReady] = useState(false)
  

    const sunMaxHeight = 30
    const sunMaxBrightness = 1
    let sunCurrBrightness = 0.01
    let sunCurrHeight = -20

    const [hoveredTarget, setHoveredTarget] = useState(null)

    const nav = useNavigate()

    const {font} = useGlobalContext()


    useFrame(() => {
      if (spotlightRef.current && model.current) {
        model.current.getWorldPosition(spotlightRef.current.target.position)
      }
    })

    useEffect(() => {
      const spotlight = spotlightRef.current
      const target = spotlight?.target?.current
    
      if (spotlight && target && !r3fScene.children.includes(target)) {
        r3fScene.add(target)
      }
    }, [])

    useFrame(({ clock }) => {
        if (!sunMesh.current) return
      
        const sunObject = sunMesh.current.children[0]
      
        if (sunObject.intensity < sunMaxBrightness) {
          sunCurrBrightness += 0.001
          sunObject.intensity = sunCurrBrightness
        }
      
        if (sunCurrHeight < sunMaxHeight) {
          sunCurrHeight += 0.1
          sunMesh.current.position.set(-70, sunCurrHeight, -100)
        }
      })

      useEffect(() =>{
        if(!planeRef.current){
          console.log('not ready')
        } else {
          console.log('ready')
            setGroundReady(true)
        }
      }, [planeRef])

    const textures = useTexture({
      map: '/Grass_Texture/Grass_Color.jpg',
      normalMap: '/Grass_Texture/Grass_NormalDX.jpg',
      roughnessMap: '/Grass_Texture/Grass_Roughness.jpg',
    })
  
    if (!textures.map || !textures.normalMap || !textures.roughnessMap) return null
  
    Object.values(textures).forEach((tex) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping
      tex.repeat.set(10, 10)
      tex.anisotropy = 16
    })


  
    return (
      <>
        <directionalLight intensity={0.09} position={[0,20,100]} />
                <mesh ref={sunMesh} castShadow receiveShadow position={[-100,sunCurrHeight,-100]}>
                    <sphereGeometry args={[20, 64, 64]} />
                    <meshStandardMaterial 
                        color='orange'
                        emissive="gold"
                        emissiveIntensity={1}
                        toneMapped={true}
                        />
                    <directionalLight castShadow intensity={sunCurrBrightness} position={[0,0,30]} />
                </mesh>
        <RobotModel bodyRef={null} joystick={null} pos={[0,0,3.9]}/>

        <ambientLight intensity={0.6}/>

        {groundReady && 
          <>
            <SquareBear nav={nav} gltf={models.SquareBear}/>
            <StuffedBear nav={nav} gltf={models.StuffedBear}/>
          </>
        }
        

        <mesh castShadow position={[0,6,-6]}>
          <Sparkles 
            count={75}
            size={3}
            scale={[8, 0.5, 3]}
            color={'magenta'}
            speed={2}
          />
          <Sparkles 
            count={75}
            size={3}
            scale={[8, 0.5, 3]}
            color={'skyBlue'}
            speed={2}
          />
            <Billboard>
              <Center>
                <Text3D
                    font={font}
                    size={0.5}
                    height={0.05}
                    curveSegments={64}
                    bevelEnabled
                    bevelThickness={0.02}
                    bevelSize={0.02}
                    bevelOffset={0}
                    bevelSegments={8}
                    castShadow
                  >
                Emotional Support Creatures
                <meshStandardMaterial
                  attach="material"
                  color={'white'}
                  metalness={0.5}
                  roughness={1}
                  transparent
                  opacity={1}
                />
                </Text3D>
              </Center>
          </Billboard>
        </mesh>


        <RigidBody ref={planeRef} userData="floor-plane" type="fixed" colliders="cuboid">
          <mesh rotation={[degrees(-90), degrees(0), degrees(0)]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshLambertMaterial {...textures} />
          </mesh>
        </RigidBody>
        </>
    )
  }

export default ESCLandscape;