import { SpotLight, useGLTF } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { RigidBody } from '@react-three/rapier'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { CuboidCollider } from '@react-three/rapier'

const degrees = (d) => d * (Math.PI / 180)

const RobotModel = ({ bodyRef, joystick, pos, rot}) => {

 let debugSpeed = 0.5

  const { scene } = useGLTF('/robot.glb')
  const [robot, setRobot] = useState([])
  const [speed, setSpeed] = useState(debugSpeed)
  const groupRef = useRef()
  const spotlightRef = useRef()
  const liftRef = useRef(0)
  const { scene: r3fScene } = useThree()
  const headLamp = useRef()

  const keys = useRef({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false
  })

  const maxTilt = 10

  useEffect(() => {
    // console.log(speed)
  }, [speed])

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
    let emmIndex = [4,6]
    if (scene) {
      const clones = scene.children.map((child, index) => {
        const object = child.clone()
  
        object.traverse((node) => {
          if (node.isMesh && emmIndex.includes(index)) {
            node.material = new THREE.MeshStandardMaterial({
              color: 'white',
              metalness: 1,
              roughness: 0.4,
              emissive:"grey",
              emissiveIntensity: 0.2,
              toneMapped: true
            })
            node.castShadow = true
            node.receiveShadow = true
          } else if (node.isMesh && !emmIndex.includes(index)){
            node.material = new THREE.MeshStandardMaterial({
                color: 'white',
                metalness: 3,
                roughness: 1,
              })
              node.castShadow = true
              node.receiveShadow = true
          }
        })
  
        return <primitive object={object} key={index} />
      })
  
      setRobot(clones)
    }
  }, [scene])

  useFrame(() => {
    if (!bodyRef || !bodyRef.current || !groupRef.current || !spotlightRef.current) return;

    console.log(bodyRef.current)

    const impulse = new THREE.Vector3()
    let tiltX = 0
    let tiltZ = 0

    const up = keys.current['ArrowUp']
    const down = keys.current['ArrowDown']
    const left = keys.current['ArrowLeft']
    const right = keys.current['ArrowRight']
    const hover = keys.current['Space']

    if(joystick && joystick.force) {
        console.log(joystick.force)
    }

    // If joystick is active, use its input instead of keys
    if (joystick && joystick.force > 0) {
        impulse.x += Math.cos(joystick.angle) * joystick.force * speed
        impulse.z += -Math.sin(joystick.angle) * joystick.force * speed
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

    if (hover) impulse.y += speed

    if (impulse.lengthSq() > 0) bodyRef?.current?.applyImpulse(impulse, true)


    // Hover lift effect
    const isMoving = impulse.lengthSq() > 0
    const targetLift = isMoving ? 0.5 : 0
    liftRef.current = THREE.MathUtils.lerp(liftRef.current, targetLift, 0.1)
    groupRef.current.position.y = liftRef.current

   // Direction-based rotation
if (impulse.lengthSq() > 0) {
    const angle = Math.atan2(impulse.x, impulse.z) // ← yaw rotation
    const targetRotation = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(degrees(tiltX), angle, degrees(tiltZ))
    )
  
    const currentQuat = new THREE.Quaternion().copy(bodyRef?.current.rotation())
    currentQuat.slerp(targetRotation, 0.1) // Smooth interpolation
    bodyRef?.current.setRotation(currentQuat, true)
  } else {
    // Maintain upright tilt when idle
    const uprightQuat = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(degrees(0), bodyRef.current.rotation().y, degrees(0))
    )
    bodyRef?.current.setRotation(uprightQuat, true)
  }

    // Move spotlight with robot
    const pos = bodyRef?.current.translation()
    spotlightRef.current.position.set(pos.x, pos.y + 5, pos.z)
    spotlightRef.current.target.position.set(pos.x, pos.y, pos.z)
    if (!spotlightRef.current.target.parent) r3fScene.add(spotlightRef.current.target)
  })

  return (
    <>
      <group ref={groupRef} >
        <SpotLight color="skyblue" castShadow angle={0} ref={spotlightRef} distance={0} penumbra={0}/>
        <pointLight color='skyBlue' intensity={0.01}/>
        {bodyRef 
        ? 
        
        <RigidBody
          ccd 
          userData='robot-mesh'
          ref={bodyRef}
          type="dynamic"
          colliders={false}
          friction={0}
          restitution={0.5}
          mass={1000}
          linearDamping={5}
          angularDamping={0.1}
          enabledRotations={[false, true, false]}
          onCollisionEnter={(target, other) => {
            
            if(target.rigidBody.userData !== 'floor-plane' && target.rigidBody.userData !== 'platform'){
                console.log('collision', target.rigidBody.userData)
                setSpeed(prev => prev * 3)
            }
        }}
          onCollisionExit={() => setSpeed(debugSpeed)}
        >
          {robot}
          <CuboidCollider userData='robot-collider' args={[0.5, 1, 0.5]} position={[0, 1, 0]} />
        </RigidBody>
        : 
        <group position={pos} rotation={[degrees(0), rot > 0 ? rot : degrees(180), degrees(0)]} >
          {robot}
        </group>  
      }
      </group>
    </>
  )
}

export default RobotModel
