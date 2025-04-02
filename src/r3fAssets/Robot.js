import { RigidBody, useRapier } from '@react-three/rapier'
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import HomePageText from './HomePageText'
import CameraFollow from './CameraController'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import HeadModel from '../components/HeadModel'
import Platform from './Platform'
import { SpotLight } from '@react-three/drei'
import { SpotLightHelper } from 'three'
import { useHelper } from '@react-three/drei'
import { CuboidCollider } from '@react-three/rapier'
import { Scene } from 'three'

const degrees = (d) => d * (Math.PI / 180)

const Robot = ({ position = [0, 1, 0], color = 'silver', bodyRef}) => {
    const { scene } = useThree()
    const fadeDir = useRef(0)
    const lightMax = 2
    const lightMin = 0.1
    const fadeSpeed = 0.01

    const speed = 0.1
    const maxTilt = 10 // degrees
    const liftRef = useRef(0) // 0 = grounded
    const groupRef = useRef()
    const leftLegLightRef = useRef()
    const rightLegLightRef = useRef()
    const rightLegRef = useRef()
    const leftLegRef = useRef()
      
        const keys = useRef({
          ArrowUp: false,
          ArrowDown: false,
          ArrowLeft: false,
          ArrowRight: false,
        })
      
        useEffect(() => {
          const down = (e) => (keys.current[e.code] = true)
          const up = (e) => (keys.current[e.code] = false)
          window.addEventListener('keydown', down)
          window.addEventListener('keyup', up)
          return () => {
            window.removeEventListener('keydown', down)
            window.removeEventListener('keyup', up)
          }
        }, [])

        useEffect(() => {
            if(rightLegRef.current){
                console.log(rightLegRef.current)
            }
        }, [rightLegRef])
      
        useFrame(() => {
            if (!bodyRef.current || !leftLegLightRef.current || ! rightLegRef.current || !leftLegRef.current || !rightLegLightRef.current) return

            const fadeLight = (lightRef, dirRef) => {
                if (!lightRef.current) return
            
                const light = lightRef.current
                const dir = dirRef.current
            
                if (dir === 1 && light.intensity < lightMax) {
                  light.intensity = Math.min(light.intensity + fadeSpeed, lightMax)
                  if (light.intensity >= lightMax) dirRef.current = 0
                }
            
                if (dir === -1 && light.intensity > lightMin) {
                  light.intensity = Math.max(light.intensity - fadeSpeed, lightMin)
                  if (light.intensity <= lightMin) dirRef.current = 0
                }
              }
            



          
            const rot = bodyRef.current.rotation()
            const leftLegWorldPos = new THREE.Vector3()
            const rightLegWorldPos = new THREE.Vector3()

            leftLegRef.current.getWorldPosition(leftLegWorldPos)
            leftLegLightRef.current.position.copy(leftLegWorldPos)

            rightLegRef.current.getWorldPosition(rightLegWorldPos)
            rightLegLightRef.current.position.copy(rightLegWorldPos)

            const impulse = new THREE.Vector3()
            let tiltX = 0
            let tiltZ = 0
            const up = keys.current['ArrowUp']
            const down = keys.current['ArrowDown']
            const left = keys.current['ArrowLeft']
            const right = keys.current['ArrowRight']
            const hover = keys.current['Space']

            leftLegLightRef.current.rotation.x = rot.x
            leftLegLightRef.current.rotation.z = rot.z

            rightLegLightRef.current.rotation.x = rot.x
            rightLegLightRef.current.rotation.z = rot.z
            

            const leftLegTargetPos = leftLegWorldPos.clone().add(new THREE.Vector3(0, -1, 0))
            const rightLegTargetPos = rightLegWorldPos.clone().add(new THREE.Vector3(0, -1, 0))
            leftLegLightRef.current.target.position.copy(leftLegTargetPos)
            rightLegLightRef.current.target.position.copy(rightLegTargetPos)
          
            // Add the target to the scene if not already
            if (!leftLegLightRef.current.target.parent) {
              scene.add(leftLegLightRef.current.target)
            }

            if (!rightLegLightRef.current.target.parent) {
                scene.add(rightLegLightRef.current.target)
              }
          
            if (up) {
              impulse.z -= speed
              tiltX = -maxTilt
            }
            if (down) {
              impulse.z += speed
              tiltX = maxTilt
            }
            if (left) {
              impulse.x -= speed
              tiltZ = maxTilt
            }
            if (right) {
              impulse.x += speed
              tiltZ = -maxTilt
            }

            if(hover) {
                impulse.y += speed

            }

            if (!up && !down) tiltX = 0
            if (!left && !right) tiltZ = 0
          
            if (impulse.lengthSq() > 0) {
              bodyRef.current.applyImpulse(impulse, true)
            }

            const isMoving = impulse.lengthSq() > 0

            fadeDir.current = isMoving ? 1 : -1
            fadeLight(leftLegLightRef, fadeDir)
            fadeLight(rightLegLightRef, fadeDir)

            const targetLift = isMoving ? 0.8 : 0
            liftRef.current = THREE.MathUtils.lerp(liftRef.current, targetLift, 0.01)

            // Apply lift to group
            if (groupRef.current) {
            groupRef.current.position.y = position[1] + liftRef.current
}
          
            const targetQuat = new THREE.Quaternion().setFromEuler(
              new THREE.Euler(degrees(tiltX), 0, degrees(tiltZ))
            )
          
            const currentQuat = new THREE.Quaternion().copy(bodyRef.current.rotation())
            currentQuat.slerp(targetQuat, 0.1)
            bodyRef.current.setRotation(currentQuat, true)
          })
          
          

    return (
        <>
      <group ref={groupRef} position={position}>
        <RigidBody 
            userData={{ name: 'robot' }}
            ref={bodyRef} 
            colliders={false} 
            type='dynamic' 
            friction={0} 
            restitution={0} 
            mass={100}
            linearDamping={2} // ← Increase this for faster deceleration
            angularDamping={1}
            >

        <mesh name="robot-head" position={[0, 1.6, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.5, 16]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <CuboidCollider args={[0.3, 0.3, 0.3]} position={[0, 1.6, 0]} />
  
        <mesh name="robot-torso"  position={[0, 0.5, 0]}>
          <boxGeometry args={[1, 1.5, 0.5]} />
          <cylinderGeometry args={[0.25, 0.5, 2, 16]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <CuboidCollider args={[0.5, 0.75, 0.25]} position={[0, 0.5, 0]} />
  
        <mesh name="robot-leg-left" ref={leftLegRef} position={[-0.3, -0.8, 0]}>
        <cylinderGeometry args={[0.09, 0.3, 1.2, 16]} />
        <meshStandardMaterial color={color} />
        </mesh>
        <CuboidCollider
        name="robot-leg-left"
        args={[0.3 / 2, 1.2 / 2, 0.3 / 2]} // x: half-width, y: half-height, z: depth
        position={[-0.3, -0.7, 0]}
        />

        
        <mesh name="robot-leg-right" ref={rightLegRef} position={[0.3, -0.8, 0]}>
        <cylinderGeometry args={[0.09, 0.3, 1.2, 16]} />
        <meshStandardMaterial color={color} />
        </mesh>
        <CuboidCollider
        name="robot-leg-right"
        args={[0.3 / 2, 1.2 / 2, 0.3 / 2]}
        position={[0.3, -0.7, 0]}
        />

        </RigidBody>
      </group>
            <spotLight
                name="robot-spotlight"
                ref={leftLegLightRef}
                angle={Math.PI / 6}
                penumbra={0.5}
                distance={5}
                color="skyBlue"
            />
            <spotLight
                name="robot-spotlight"
                ref={rightLegLightRef}
                angle={Math.PI / 6}
                penumbra={0.5}
                distance={5}
                color="skyBlue"
            />       
          </>
    )
  }
  

export default Robot;