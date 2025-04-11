import { useEffect, useRef, useState } from 'react'
import { Billboard, Html, Text3D } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import LetterStack from './LetterStack'
import ForceFieldMaterial from './ForceFieldMaterial'
import { useFrame } from '@react-three/fiber'
import { SpotLight } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useGlobalContext } from '../business/GlobalContext'
import { interactionGroups } from '@react-three/rapier'
import { useRapier } from '@react-three/rapier'

const degrees = (degrees) => degrees * (Math.PI / 180)

const Platform = ({pos, dims, text, def}) => {

    return (
        <group>
            <RigidBody type='fixed' colliders='cuboid'>
                <mesh position={pos}>
                    <boxGeometry args={dims} />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </RigidBody>
            <group position={[-0.5,5.5,-0.75]}>
                <LetterStack lt={text} def={def}/>
            </group>
        </group>
    )
}

const AcronymScene = () => {
    const matRef = useRef()
    const spotlightRef = useRef()
    const model = useRef()
    const { scene: r3fScene } = useThree()
    const [letterStacks, setLetterStacks] = useState([])
    const [startingPos] = useState([-22,-5.02,-22])
    const [collDet, setCollDet] = useState(false)
    const forceField = useRef()
    const { world } = useRapier()
    const rawWorld = world.raw()

    const stackArray = [
        {acronym: 'PBJ', definition: 'Peace Belonging and Joy'},
        {acronym: 'IRS', definition: 'Inner Relational Space'}, 
        {acronym: 'ESC', definition: 'Emotional Support Creatures'}
    ]

    useFrame(() => {
      if (matRef.current && collDet) {
        matRef.current.uColor.set('red')
        matRef.current.uAlpha.set(1)
      }

      if(matRef.current && !collDet){
        matRef.current.uColor.set('deepSkyBlue')
      }
    })

    useEffect(() => {
      if(collDet){
        setTimeout(() => {
          setCollDet(false)
        }, 1000);
      }
    }, [collDet])

    useFrame(({ clock }) => {
        if (matRef.current) {
          matRef.current.uTime = clock.getElapsedTime()
        }
        if (spotlightRef.current && model.current) {
            model.current.getWorldPosition(spotlightRef.current.target.position)
          }
      })

    useEffect(() => {
        const spotlight = spotlightRef.current
        const target = spotlight?.target?.current
      
        if (spotlight && target && !r3fScene.children.includes(target)) {
          r3fScene.add(target)
          console.log('Added spotlight target to scene')
        }

        setLetterStacks( 
            stackArray.map((s, i) => {
              let offset = i * 4 // Space each platform 8 units apart
              let pos = [startingPos[0] + offset, startingPos[1], startingPos[2]]
              return (
                <group key={s} position={pos}>
                    <Platform pos={[0, 4.5, 0]} dims={[2, 0.05, 4]} text={s.acronym} def={s.definition} />
                </group>
              )
            })
          )

      }, [])

      useFrame(() => {
              const pos = new THREE.Vector3()

                if (spotlightRef.current && model.current) {
                model.current.getWorldPosition(pos)
            
                spotlightRef.current.target.position.set(pos.x, pos.y, pos.z+2)
                spotlightRef.current.position.set(pos.x +75, pos.y+40, pos.z +26)
              }
            })
        
            useEffect(() => {
              if (spotlightRef.current && !r3fScene.children.includes(spotlightRef.current.target)) {
                r3fScene.add(spotlightRef.current.target)
              }
            }, [])

  return (
    <group key={5} position={[-75,0,-25]}>
        <SpotLight
            ref={spotlightRef}
            intensity={50}
            distance={48}
            angle={degrees(180)}
            attenuation={11}
            anglePower={degrees(2)}
            color={'skyBlue'}
            castShadow
        /> 

        {/* <group  position={[0,0,-25.5]}>  
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider
            ref={forceField}
            args={[25, 5, 0.5]}
            collisionGroups={interactionGroups([2], [0])}
          />
          <mesh>
            <boxGeometry args={[50, 10, 1]} />
            <meshStandardMaterial color="white" transparent opacity={0} />
          </mesh>
        </RigidBody>
        </group> */}

        {/* <group position={[-25.5,0,0]} rotation={[degrees(0), degrees(90), degrees(0)]}>
          <RigidBody
            position={[0,0,0]}
            type="fixed"
            colliders='cuboid'
            collisionGroups={interactionGroups([2], [0])}
            restitution={5}
            onCollisionEnter={({ target, other }) => {
              setCollDet(true)
            }}
            >
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[50,10,1]} />
              <meshStandardMaterial color={'white'} transparent opacity={0}/>
            </mesh>
          </RigidBody>
        </group> */}

        {/* <group position={[25.5,0,0]} rotation={[degrees(0), degrees(90), degrees(0)]}>
          <RigidBody
            position={[0,0,0]}
            type="fixed"
            colliders='cuboid'
            collisionGroups={interactionGroups([2], [0])}
            restitution={5}
            onCollisionEnter={({ target, other }) => {
              setCollDet(true)
            }}
            >
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[50,10,1]} />
              <meshStandardMaterial color={'white'} transparent opacity={0}/>
            </mesh>
          </RigidBody>
        </group> */}


          {/* <RigidBody
            type="fixed"
            colliders={false}
          >
            <mesh ref={model} position={[0, 0, 0]}>
                <boxGeometry args={[50,50,50]} />
                <forceFieldMaterial ref={matRef} transparent side={THREE.DoubleSide} />
            </mesh>
        </RigidBody> */}
        <group>
            {letterStacks && letterStacks}
        </group>
    </group>
  );
};

export default AcronymScene;