import { Center, SpotLight, Text3D, useGLTF } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { RigidBody } from '@react-three/rapier'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { CuboidCollider } from '@react-three/rapier'
import { useTexture } from '@react-three/drei'
import { useCursor } from '@react-three/drei'
import { Sparkles } from '@react-three/drei'
import { Billboard, Html } from '@react-three/drei'
import { useGlobalContext } from '../business/GlobalContext';
import { useProgress } from '@react-three/drei'

const degrees = (d) => d * (Math.PI / 180)

const SquareBear = ({nav, gltf}) => {
    const {returnUrl, setReturnUrl} = useGlobalContext()
    const [bear, setBear] = useState([])
    const [toggleHover, setToggleHover] = useState(false)
    useCursor(toggleHover, /*'pointer', 'auto', document.body*/)
    const { scene: r3fScene } = useThree()

    const spotlightRef = useRef()
    const sparkleRef = useRef()
    const model = useRef()
    const body = useRef()

    const [fontSize, setFontSize] = useState(2)
    const [font, setFont] = useState("/fonts/Fredoka_Regular.json")

        const textures = useTexture({
              map: '/Fabric_Texture/Fabric_Color.png',
              normalMap: '/Fabric_Texture/Fabric_NormalDX.png',
              roughnessMap: '/Fabric_Texture/Fabric_Roughness.png',
            })
          
            if (textures.map && textures.normalMap && textures.roughnessMap){   
                Object.values(textures).forEach((tex) => {
                    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
                    tex.repeat.set(2,2)
                    tex.anisotropy = 16
                })
            }

      useEffect(() => {
        let emmIndex = [4,6]
        if (gltf) {
            console.log(gltf)
          const clones = gltf.children.map((child, index) => {
            const object = child.clone()
      
            object.traverse((node) => {
              if (node.isMesh && emmIndex.includes(index)) {
                node.material = new THREE.MeshStandardMaterial({
                  map: textures.map,
                  normalMap: textures.normalMap,
                  roughnessMap: textures.roughnessMap,
                  color: 'green',
                  metalness: 3,
                  roughness: 0.5,
                  emissive:"grey",
                  emissiveIntensity: 0.2,
                  toneMapped: true
                })
                node.castShadow = true
                node.receiveShadow = true
              } else if (node.isMesh && !emmIndex.includes(index)){
                    object.scale.set(0.25, 0.25, 0.25)
                    object.position.set(0, 0, -2)
                    object.rotation.set(degrees(0), degrees(180), degrees(0))
                node.material = new THREE.MeshStandardMaterial({
                    map: textures.map,
                    normalMap: textures.normalMap,
                    roughnessMap: textures.roughnessMap,
                    metalness: 0,
                    roughness: 10,
                    color: 'tan',
                    castShadow : true,
                    receiveShadow: true
                  })
                  node.castShadow = true
                  node.receiveShadow = true
              }
            })
      
            return <primitive object={object} key={index} />
          })
      
          setBear(clones)
        }
      }, [gltf])

      useFrame(() => {
        if (spotlightRef.current && model.current && sparkleRef.current) {
          const pos = new THREE.Vector3()
          model.current.getWorldPosition(pos)
      
          spotlightRef.current.target.position.set(pos.x, pos.y, pos.z-2.25)
          spotlightRef.current.position.set(pos.x, pos.y + 10, pos.z - 3.5)
          sparkleRef.current.position.set(pos.x, pos.y+1, pos.z -3.5)
        }
      })
  
      useEffect(() => {
        if (spotlightRef.current && !r3fScene.children.includes(spotlightRef.current.target)) {
          r3fScene.add(spotlightRef.current.target)
        }
      }, [])

      const handleNav = () => {
        nav('/error')
        setReturnUrl('/esc')
    }

    return (
        <>

    <RigidBody
        position={[5.5, 5, -6]}
        colliders={false}
        restitution={1}
        enabledRotations={[false, false, false]}
        castShadow
        >
        <group
          ref={model}
          onPointerOver={(e) => {
              setToggleHover(true)
            }}
            onPointerOut={() => {
                setToggleHover(false)
            }}
            onClick={() => handleNav()}
            castShadow
            >
          {bear}
        </group>
      
        <CuboidCollider args={[0.5, 1, 0.5]} position={[0, 1, -2]} />
      </RigidBody>


        <group position={[0,0.5,1.5]}>
      {toggleHover && 
      <>
        <SpotLight
            ref={spotlightRef}
            intensity={5}
            distance={25}
            angle={degrees(30)}
            attenuation={11}
            anglePower={0}
            color={'skyBlue'}
            castShadow
            />    
        <Sparkles 
            ref={sparkleRef}
            count={200}
            size={5}
            scale={3}
            color={'white'}
            speed={2}
            />
      </>
        }
        </group>
          <mesh position={[5.25, 4, -8]}>
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
                          About ESC's
                          <meshStandardMaterial
                          attach="material"
                          color={'white'}
                          metalness={1}
                          roughness={0.5}
                          transparent
                          opacity={1}
                          />
                          </Text3D>
                          </Center>
                      </Billboard>
                    </mesh>
        </>
  );
};

export default SquareBear;