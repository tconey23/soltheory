import { CuboidCollider, RigidBody, useRapier } from '@react-three/rapier'
import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useThree } from '@react-three/fiber'
import { Billboard, ContactShadows, Html, SpotLight } from '@react-three/drei'
import { SpotLightHelper } from 'three'
import { useHelper } from '@react-three/drei'
import RobotModel from './RobotModel'
import * as THREE from 'three'
import HomePageText from './HomePageText'
import CameraFollow from './CameraController' 
import Platform from './Platform'
import AcronymScene from './AcronymScene'
import { interactionGroups } from '@react-three/rapier'
import { useTexture } from '@react-three/drei'
import { Environment } from '@react-three/drei'
import { Lightformer } from '@react-three/drei'

const degrees = (degrees) => degrees * (Math.PI / 180)



const FlatBackground = () => {
  const texture = useTexture('/nightSky.jpg')

  return (
    <mesh position={[0, 0, -20]} scale={[16, 9, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  )
}

  const BallLandscape = ({joystickData}) => {
    const ballRef = useRef()
    const spotLightRef = useRef()
    const targetRef = useRef()
    const letters = useRef()
    const { scene } = useThree()
    const [showRobot, setShowRobot] = useState(true)
    const [turnAround, setTurnAround] = useState(true)
    

    const spotlightRef1 = useRef()
    const spotlightRef2 = useRef()
  
    // useHelper(spotlightRef, SpotLightHelper, 'teal')

    const textures = useTexture({
      map: '/ground_texture/BaseColor.jpg',
      aoMap: '/ground_texture/AmbientOcclusion.jpg',
      displacementMap: '/ground_texture/Displacement.png',
      metalnessMap: '/ground_texture/Metallic.png',
      normalMap: '/ground_texture/Normal.png',
      roughnessMap: '/ground_texture/Roughness.png',
    })

    if (textures.map && textures.normalMap && textures.roughnessMap){   
        Object.values(textures).forEach((tex) => {
            tex.wrapS = tex.wrapT = THREE.RepeatWrapping
            tex.repeat.set(150,150)
            tex.anisotropy =16
        })
    }

    console.log(textures)

    useEffect(() => {
        if (spotlightRef1.current && targetRef.current) {
            spotlightRef1.current.target = targetRef.current
            spotlightRef2.current.target = targetRef.current
          scene.add(targetRef.current)
        }
      }, [scene])

      useEffect(() =>{
        if(letters.current){
          const intervalId = setInterval(() => {
            // setShowRobot(true)
          }, 2000)
        
          return () => clearInterval(intervalId)
        }
      }, [letters])
  
    return (
      <>
        {/* <SpotLight
            ref={spotlightRef1}
            position={[40,200,0]}
            angle={degrees(280)}
            penumbra={0.75}
            intensity={30}
            distance={220}
            castShadow
            color={'deepSkyBlue'}
            target={targetRef.current}
        /> */}
        {/* <SpotLight
            ref={spotlightRef2}
            position={[-40,200,0]}
            angle={degrees(280)}
            penumbra={0.75}
            intensity={50}
            distance={220}
            castShadow
            color={'purple'}
            target={targetRef.current}
        /> */}

        {/* <SpotLight
            ref={spotlightRef2}
            position={[0,200,40]}
            angle={degrees(280)}
            penumbra={0.75}
            intensity={50}
            distance={220}
            castShadow
            color={'white'}
            target={targetRef.current}
        /> */}

        {/* <object3D ref={targetRef} position={[0,2,0]}>
        </object3D> */}

      {/* <group ref={letters}>
        <group scale={2} position={[-1.5, 1, -5]}>
          <HomePageText text={'SOL'} thickness={0.4} type={'dynamic'} pos={[-1.5, 1, -5]}/>
        </group>

        <group scale={1} position={[-1.8, 1, -3]}>
          <HomePageText text={'Theory®'} thickness={0.4} type={'dynamic'} pos={[-1.8, 1, -3]}/>
        </group>

        <group scale={2} position={[-7, 1, -25]}>
          <HomePageText text={'Find UR Better'} thickness={0.5} type={'dynamic'} charOffset={0.82} col={'white'} pos={[-7, 1, -25]}/>
        </group>
      </group> */}
  
        {showRobot && 
        <>
            <RobotModel bodyRef={ballRef} joystick={joystickData} setTurnAround={setTurnAround} turnAround={turnAround} />
            {/* <CameraFollow turnAround={turnAround} setTurnAround={setTurnAround} targetRef={ballRef} offset={new THREE.Vector3(-2, 5, 5)} />  */}
        </>
        }

        {/* <AcronymScene /> */}
  
        <RigidBody userData='floor-plane' type="fixed" colliders='cuboid' collisionGroups={interactionGroups([3], [0,1,2])}>
          <mesh receiveShadow position={[0, -1, 0]}>
            <boxGeometry args={[500, 1, 500]} />
            <meshStandardMaterial {...textures}/>
          </mesh>
          <CuboidCollider args={[500, 1, 500]} position={[0, -1, 0]}/>
        </RigidBody>

        {/* <mesh 
          scale={100} 
          position={[3, -0.2, -1.5]} 
          rotation={[-Math.PI / 2, 0, Math.PI / 2.5]}
        >
          <ringGeometry args={[0.9, 1, 6, 1]} />
          <meshStandardMaterial 
            color="white" 
            roughness={0.75} 
            emissive="rebeccapurple" 
            emissiveIntensity={5} 
          />
        </mesh> */}

        {/* <mesh scale={150} position={[-3, -0.18, -1]} rotation={[-Math.PI / 2, 0, Math.PI / 2.5]}>
          <ringGeometry args={[0.9, 1, 3, 1]} />
          <meshStandardMaterial
              color="blue" 
              roughness={0.75} 
              emissive="rebeccapurple" 
              emissiveIntensity={5} 
          />
        </mesh> */}


        {/* <Platform position={[0, -0.12, -30]} fieldDims={[4.8, 5, 4.8]} dims={[5, 0.08, 5]} bevelRadius={0.1} bevelSmoothness={8} text={'Games'} endpoint={'/games'} clickText={'See Games'} triggerObject={'robot-mesh'}/> */}
        
        {/* <Platform position={[20, -0.1, -30]} fieldDims={[4.8, 5, 4.8]} dims={[5, 0.08, 5]} bevelRadius={0.1} bevelSmoothness={8} text={'ESC'} endpoint={'/esc'} clickText={'See ESCs'} triggerObject={'robot-mesh'}/> */}
        <FlatBackground />
        <Environment 
          resolution={720} 
          preset={null}
          background={false}
          backgroundBlurriness={0.05} // optional blur factor between 0 and 1 (default: 0, only works with three 0.146 and up)
          backgroundIntensity={2} // optional intensity factor (default: 1, only works with three 0.163 and up)
          // backgroundRotation={[0, Math.PI / 2, 0]} // optional rotation (default: 0, only works with three 0.163 and up)
          environmentIntensity={1} // optional intensity factor (default: 1, only works with three 0.163 and up)
          // environmentRotation={[0, Math.PI / 2, 0]}
          files={'/nightSky.jpg'}
        >
        {/* <Lightformer  form="ring" color="darkorange"  intensity={3} rotation-x={degrees(0)} position={[0, 2, 0]} scale={[10, 1, 1]} /> */}
        <Lightformer  form="ring" color="rebeccapurple"  intensity={2} rotation-x={Math.PI / 2} position={[0, 2, 0]} scale={[10, 1, 1]} />
        <Lightformer  form="ring" color="limeGreen"  intensity={2} rotation-z={degrees(45)} position={[0, 2, 0]} scale={[10, 1, 1]} />
        <Lightformer form="ring" color="deepSkyBlue" intensity={2} rotation-z={degrees(-90)} position={[0, 2, 0]} scale={[10, 1, 1]} />
        {/* Sides */}
        <Lightformer form="ring" color="deepSkyBlue" intensity={2} rotation-y={Math.PI / 2} position={[0, 2, 0]} scale={[100, 2, 1]} />
        <Lightformer form="ring" color="hotPink" intensity={2} rotation-y={-Math.PI / 2} position={[0, 2, 0]} scale={[100, 2, 1]} />
        {/* Key */}
        <Lightformer form="ring" color="red" intensity={10} scale={2} position={[10, 5, 10]} onUpdate={(self) => self.lookAt(0, 0, 0)} />
      </Environment>
      
      </>
    )
  }

export default BallLandscape;