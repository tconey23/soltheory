import { SpotLight, useGLTF } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { RigidBody } from '@react-three/rapier'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { CuboidCollider } from '@react-three/rapier'
import { interactionGroups } from '@react-three/rapier'
import { useAnimations } from '@react-three/drei'

const degrees = (d) => d * (Math.PI / 180)

const RobotModel = ({ bodyRef, joystick, pos, rot}) => {

  useGLTF.preload('/AnimatedRobot.glb')

 let debugSpeed = 300

 const groupRef = useRef()
 const { scene, animations } = useGLTF('/AnimatedRobot.glb')
 const { actions, mixer } = useAnimations(animations, groupRef)
  const [robot, setRobot] = useState([])
  const [speed, setSpeed] = useState(debugSpeed)
  const spotlightRef = useRef()
  const { scene: r3fScene } = useThree()
  const [sprinting, setSprinting] = useState(false)
  const [sprintMult, setSprintMult] = useState(2)
  const [addBip, setAddBip] = useState(false)
  const [bored, setBored] = useState(false)

  const lastRotationRef = useRef(new THREE.Quaternion())
  const animName = 'Bip_Walking'
  const animWaving = 'Bip_Waving'
  const animJump = 'Bip_Jump'

  const [currentAnim, setCurrentAnim] = useState(null)

  const keys = useRef({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
    ShiftLeft: false
  })

  const maxHeight = 5
  const maxTilt = 10

  mixer._actions.forEach((action) => {
    if (action.isRunning()) {
      console.log(`→ ${action._clip.name}`)
    }
  })

  const playAnimation = (name, loop = THREE.LoopRepeat, clamp = false) => {
    Object.values(actions).forEach((action) => {
      if (action.isRunning()) action.fadeOut(0.3)
    })
    const anim = actions[name]
    if (!anim) return
    anim.reset().fadeIn(0.3).setLoop(loop)
    anim.clampWhenFinished = clamp
    anim.play()
    setCurrentAnim(name)
  }
  

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
    if (!scene) return
    scene.visible = true

    console.log(animations)
  
    scene.traverse((node) => {
      if (node.isMesh && node.material?.color?.isColor) {

        node.material.metalness = 0.5
        node.material.roughness = 0.5
        node.material.wireframe = false
        node.castShadow = true
        node.receiveShadow = true

        const { r, g, b } = node.material.color
        if(r > 0){
          node.material = new THREE.MeshPhysicalMaterial({
            color: 0xaaaaaa,
            emissive: new THREE.Color('deepSkyBlue'),
            emissiveIntensity: 1.2,
            roughness: 0.3,
            metalness: 0.7,
            clearcoat: 1,
            clearcoatRoughness: 0.1,
          })
        }
      }
    })
  
    setRobot(
      <group scale={[0.1, 0.1, 0.1]}>
        <primitive object={scene} />
      </group>
  )
  }, [scene])

  useEffect(() => {
    if(robot && groupRef.current) {
      setTimeout(() => {
        setAddBip(true)
      }, 2000);
    }
  }, [robot, groupRef])

  useEffect(() =>{
    if(addBip){
      setTimeout(() => {
        actions[animWaving]
          .reset()
          .fadeIn(0.3)
          .setLoop(THREE.LoopOnce)
          .clampWhenFinished = true

          actions[animWaving].play()
        setCurrentAnim(animWaving)
      }, 1000);
    }
  }, [addBip])

  useEffect(() => {
    if(currentAnim){
      if(currentAnim === animWaving){
        setTimeout(() => {
          actions['Bip_Waving'].stop()
          actions['Bip_Idle'].reset().fadeIn(0.3).play()
        }, 200);
      }
    }
  }, [currentAnim])

  useEffect(() => {
    if(bored){
        actions['Bip_Dance'].reset().fadeIn(0.3).play()
        const intervalId = setInterval(() => {
          actions['Bip_Dance'].fadeOut(0.3)
        }, 5000)
      
        return () => clearInterval(intervalId)
    }
  }, [bored])
  

  useFrame(() => {
    if (!bodyRef?.current || !groupRef.current || !spotlightRef.current) return;
  
    const impulse = new THREE.Vector3()
    let tiltX = 0
    let tiltZ = 0
  
    const up = keys.current['ArrowUp', 'KeyW']
    const down = keys.current['ArrowDown', 'KeyS']
    const left = keys.current['ArrowLeft', 'KeyA']
    const right = keys.current['ArrowRight', 'KeyD']
    const jump = keys.current['Space']
    const sprint = keys.current['ShiftLeft']
    
    if(sprint) {
      setSprinting(true)
    } else {
      setSprinting(false)
    }

    if(jump){
      actions[animJump]
          .reset()
          .fadeIn(0.3)
          .setLoop(THREE.LoopOnce)

          actions[animJump].play()
        setCurrentAnim(animJump)
    }
    
    if (joystick?.force > 0) {
      impulse.x += Math.cos(joystick.angle) * joystick.force * speed
      impulse.z += -Math.sin(joystick.angle) * joystick.force * speed
    }

    const mult = sprinting ? sprintMult : 1
  
    if (up) {
      impulse.z -= speed * mult
      tiltX = -maxTilt
    }
    if (down) {
      impulse.z += speed * mult
      tiltX = maxTilt
    }
    if (left) {
      impulse.x -= speed * mult
      tiltZ = maxTilt
    }

    if (right) {
      impulse.x += speed * mult
      tiltZ = -maxTilt
    }

    if (jump) {
      impulse.y += speed * mult
    }
  
    const isMoving = impulse.lengthSq() > 0
  
    if (isMoving) {
      bodyRef.current.applyImpulse(impulse, true)
  
      const angle = Math.atan2(impulse.x, impulse.z)
      const newQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(degrees(tiltX), angle, degrees(tiltZ))
      )
  
      // Save the new rotation as the last known direction
      lastRotationRef.current.copy(newQuat)
  
      // Apply it
      bodyRef.current.setRotation(newQuat, true)
    } else {
      // Maintain the last known rotation
      bodyRef.current.setRotation(lastRotationRef.current, true)
    }
  
    // 🔁 Animation handling
    if (isMoving) {
      bodyRef.current.applyImpulse(impulse, true)
    
      const angle = Math.atan2(impulse.x, impulse.z)
      const newQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(degrees(tiltX), angle, degrees(tiltZ))
      )
      lastRotationRef.current.copy(newQuat)
      bodyRef.current.setRotation(newQuat, true)
    
      if (currentAnim !== animName && actions[animName]) {
        playAnimation(animName)
      }
    
      const joystickForce = THREE.MathUtils.clamp(joystick?.force ?? 0, 0.1, 1)
      const speedMultiplier = 1 + joystickForce * (sprinting ? sprintMult : 1)
      actions[animName].timeScale = speedMultiplier
    
    } else {
      bodyRef.current.setRotation(lastRotationRef.current, true)
    
      if (currentAnim === animName) {
        playAnimation("Bip_Idle")
      }
    }
  
    // Spotlight follow
    const pos = bodyRef.current.translation()
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
          position={[0, 2, 0]}
          collisionGroups={interactionGroups([1], [0, 3])}
          onCollisionEnter={(target, other) => {
            
            if(target.rigidBody.userData !== 'floor-plane' && target.rigidBody.userData !== 'platform'){
                // console.log('collision', target.rigidBody.userData)
                setSpeed(prev => prev * 1.25)
            }
        }}
          onCollisionExit={() => setSpeed(debugSpeed)}
        >
          {addBip && robot}
          <CuboidCollider userData='robot-collider' args={[0.5, 1, 0.5]} position={[0, 1, 0]} collisionGroups={interactionGroups([1], [0, 3])} />
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
