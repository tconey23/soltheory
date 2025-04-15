import { useEffect, useState, useMemo } from 'react';
import { useGLTF } from '@react-three/drei'
import { Stack } from '@mui/material';
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three'
import ForceFieldMaterial from './ForceFieldMaterial';
import { RigidBody } from '@react-three/rapier';

const degrees = (d) => d * (Math.PI / 180)

const HoloLink = ({showTeleport, setShowTeleport, teleportHeight, setTeleportHeight, teleport}) => {

    const { scene: teleportScene } = useGLTF('/teleport.glb')
    const { scene: r3fScene } = useThree()
    const [teleportRampUp, setTeleportRampUp] = useState(false)

    const ambLight = useRef()
    const spotlight = useRef()
    const spotlightTarget = useRef()
    const matRef = useRef()
    const coneRef = useRef()
    const mult = useRef(1)
    const int = useRef(100)

    const outerRadius = 5
    const innerRadius = 4.5
    const height = 10

    const maxMult = 50

    useEffect(() => {
        console.log(teleport.current)
      }, [r3fScene, spotlight, spotlightTarget, teleport])

      useFrame(() => {
        if (showTeleport && teleport.current) {
          const pos = teleport.current.position.clone()
          if (pos.y < 6) {
            console.log(pos)
            teleport.current.position.set(pos.x, pos.y + 0.05, pos.z)
          }
        }

        if (!showTeleport && teleport.current) {
            const pos = teleport.current.position.clone()
            if (pos.y <= 6 && pos.y >= 0) {
              teleport.current.position.set(pos.x, pos.y - 0.05, pos.z)
            }
          }
      })

      
      useFrame(({ clock }) => {
        if (matRef.current?.uniforms?.uTime) {
          matRef.current.uniforms.uTime.value = clock.getElapsedTime() * 4
        }
      
        if (spotlight.current && spotlightTarget.current) {
          const targetPos = new THREE.Vector3()
          if (!r3fScene.children.includes(spotlight.current.target)) {
            r3fScene.add(spotlight.current.target)
          }
          spotlightTarget.current.getWorldPosition(targetPos)
          spotlight.current.target.position.copy(targetPos)
        }
      })

      useFrame(() => {
        if (matRef.current?.uniforms?.uMult && mult.current) {
            matRef.current.uniforms.uMult.value = mult.current
          }
        if (matRef.current?.uniforms?.uInt && int.current) {
        matRef.current.uniforms.uInt.value = int.current
        }

        if(mult.current && teleportRampUp && mult.current < maxMult){
            mult.current = THREE.MathUtils.lerp(mult.current, teleportRampUp ? maxMult : 1, 0.05)
        }

        if(mult.current && !teleportRampUp && mult.current > 1){
            
            mult.current -= 0.1
        }

        if(int.current && ambLight.current){
            int.current = THREE.MathUtils.lerp(int.current, teleportRampUp ? 100 : 0, 0.001)
            ambLight.current.intensity = int.current
        }

      })
    

    const forceFieldMaterial = useMemo(() => {
        return new ForceFieldMaterial({
          uColor: new THREE.Color('deepskyblue'),
          uAlpha: 0.4,
          uFogNear: 1,
          uFogFar: 2,
          uFogColor: new THREE.Color('white'),
          side: THREE.FrontSide,
          transparent: true,
          blending: THREE.NormalBlending,
          depthWrite: true,
        })
      }, [])

      useEffect(() => {
        matRef.current = forceFieldMaterial
      }, [forceFieldMaterial])

      const handleCollision = (disp) => {
        setShowTeleport(true)
        setTeleportRampUp(disp)
      }
      
  return (
    <group>
        <group position={[0, 3, 0]} ref={spotlightTarget} userData={{ label: 'spotlight target' }} />

        <group scale={0.6} position={[-5,-4,-30]} rotation={[degrees(0), degrees(-90), degrees(0)]} >
            <RigidBody
             type="fixed" 
             colliders="trimesh"
             onCollisionEnter={() => handleCollision(true)}
             onCollisionExit={() => handleCollision(false)}
            >
                <primitive scale={[2.2,2,2.2]} object={teleportScene} />
            </RigidBody>
            <mesh
                ref={coneRef}
                position={[0, 5.1, 0]}
                rotation={[Math.PI, 0, 0]}
                material={forceFieldMaterial}
            >
                <cylinderGeometry args={[2, 2, 10, 64]} />
                {/* <meshStandardMaterial color="hotpink" /> */}
            </mesh>
        </group>

        {teleportRampUp && <ambientLight ref={ambLight} intensity={0} />}

        <spotLight
            ref={spotlight}
            position={[0, 0.1, 0]}
            angle={0.4}
            penumbra={0.5}
            intensity={10}
            distance={15}
        />
    </group>
  );
};

export default HoloLink;