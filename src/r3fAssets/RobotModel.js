import { useGLTF } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { RigidBody } from '@react-three/rapier'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { CuboidCollider } from '@react-three/rapier'
import { interactionGroups } from '@react-three/rapier'
import { useAnimations } from '@react-three/drei'
import { Billboard, Html } from '@react-three/drei'
import { Stack } from '@mui/system'
import { useCursor } from '@react-three/drei'
import SpeechBubble from './SpeechBubble'

const degrees = (degrees) => degrees * (Math.PI / 180)


const RobotModel = ({ bodyRef, joystick, pos, rot, setTurnAround, turnAround}) => {

  useGLTF.preload('/AnimatedRobot.glb')

 let debugSpeed = 500

 const groupRef = useRef()
 const { scene, animations } = useGLTF('/AnimatedRobot.glb')
//  console.log(animations)
 const { actions, mixer } = useAnimations(animations, groupRef)
  const [robot, setRobot] = useState([])
  const [speed, setSpeed] = useState(debugSpeed)
  const [sprinting, setSprinting] = useState(false)
  const [sprintMult, setSprintMult] = useState(3)
  const [addBip, setAddBip] = useState(false)
  const [bored, setBored] = useState(false)
  const spotTarget = useRef()
  const [toggleOptions, setToggleOptions] = useState(false)
  const [toggleHover, setToggleHover] = useState(false)
  useCursor(toggleHover, /*'pointer', 'auto', document.body*/)
  const { scene: r3fScene } = useThree()
  const robotLight = useRef()
  const robotLightGroup = useRef()

  const menuLight = useRef()
  const menuLightTarget = useRef()
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

     scene.traverse((node) => {
      if (node.isMesh && node.material?.color?.isColor) {
        node.castShadow = true
        node.receiveShadow = true

        const { r, g, b } = node.material.color
        if(node.name === "pCylinder1"){ 

          const target = new THREE.Object3D()

          const targetDebug = new THREE.Mesh(
            new THREE.SphereGeometry(2, 16, 16),
            new THREE.MeshBasicMaterial({ color: 'red' })
          )
          
          target.position.copy(node.position).add(new THREE.Vector3(0, 10, 70)) 
          spotTarget.current = target

          node.add(target)

          const spotlight = new THREE.SpotLight('deepSkyBlue', 50, 100, degrees(45), 2);
          const pointLight = new THREE.PointLight('deepSkyBlue', 0.1, 30, 70)
          targetDebug.position.copy(scene.position).add(new THREE.Vector3(0, 20, 0))
          pointLight.position.copy(scene.position).add(new THREE.Vector3(0, 20, 8))
          // console.log(pointLight.position)
          
          spotlight.position.copy(node.position).add(new THREE.Vector3(0, 0, 0)); // Offset above the node
          spotlight.target = target; // Make the spotlight point at the mesh
          spotlight.castShadow = true;
          pointLight.castShadow = true;
          scene.castShadow = true

          spotlight.userData = 'SpotLight'
          pointLight.userData = 'PointLight'
          targetDebug.userData = 'DebugMesh'
          
          const existingDebug = scene.getObjectByProperty('userData', 'DebugMesh')
          const existingPoint = scene.getObjectByProperty('userData', 'PointLight')
          const existingSpot = node.getObjectByProperty('userData', 'SpotLight')

          node.material.transparent = true
          node.material.opacity = 0.1
          node.material.ior = 1.6
          node.material.side = THREE.DoubleSide
          node.material.transmission = 1
          node.material.thickness = 0.1
          node.material.roughness = 0
          node.material.envMapIntensity = 1.5
          node.material.metalness = 0
          
          // Replace or add debug mesh
          if (existingDebug) scene.remove(existingDebug)
          // scene.add(targetDebug)
          
          // Replace or add point light
          if (existingPoint) scene.remove(existingPoint)
          scene.add(pointLight)
          
          // Replace or add spotlight
          if (existingSpot) node.remove(existingSpot)
          node.add(spotlight)
          node.add(spotlight.target)
          
          // console.log(scene.children)
        }
      }
    })
  
    setRobot(
      <group
       scale={[0.1, 0.1, 0.1]}
      >
        <primitive
         object={scene} 
         />
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
    if(addBip && actions){
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

  useEffect(() => {
    setTimeout(() => {
      setToggleOptions(true)
    }, 3000);
  }, [])
  

  const spotlight = spotTarget.current

  const timeoutRef = useRef(null)

useFrame(() => {
  if (!bodyRef?.current || !groupRef.current || !robotLight.current) return;

  const impulse = new THREE.Vector3()
  let tiltX = 0
  let tiltZ = 0

  const up = keys.current['ArrowUp'] || keys.current['KeyW']
  const down = keys.current['ArrowDown'] || keys.current['KeyS']
  const left = keys.current['ArrowLeft'] || keys.current['KeyA']
  const right = keys.current['ArrowRight'] || keys.current['KeyD']
  const jump = keys.current['Space']
  const sprint = keys.current['ShiftLeft']

  // Update sprinting state
  setSprinting(sprint)

  if (joystick?.force > 0) {
    impulse.x += Math.cos(joystick.angle) * joystick.force * speed
    impulse.z += -Math.sin(joystick.angle) * joystick.force * speed
  }

  const mult = sprint ? sprintMult : 1

  if (up) {
    impulse.z += speed * mult
    tiltX = -maxTilt
  }
  if (down) {
    impulse.z -= speed * mult
    tiltX = maxTilt
  }
  if (left) {
    impulse.x += speed * mult
    tiltZ = maxTilt
  }
  if (right) {
    impulse.x -= speed * mult
    tiltZ = -maxTilt
  }
  if (jump) {
    impulse.y += speed * mult
    playAnimation(animJump, THREE.LoopOnce, true)
    setCurrentAnim(animJump)
  }

  const isMoving = impulse.lengthSq() > 0

  const pos = bodyRef.current.translation()

  // --- TURN AROUND AFTER IDLE ---
  if (!isMoving) {
    if (!turnAround && !timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        setTurnAround(true)
        timeoutRef.current = null
      }, 5000)
    }
  } else {
    if (turnAround) setTurnAround(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  // --- ROTATION & IMPULSE ---
  if (isMoving) {
    const angle = Math.atan2(impulse.x, impulse.z)
    const newQuat = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(degrees(tiltX), angle, degrees(tiltZ))
    )
    lastRotationRef.current.copy(newQuat)
    bodyRef.current.setRotation(newQuat, true)
    bodyRef.current.applyImpulse(impulse, true)
  } else if (turnAround) {
    const faceForward = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(0, degrees(180), 0)
    )
    bodyRef.current.setRotation(faceForward, true)
  } else {
    bodyRef.current.setRotation(lastRotationRef.current, true)
  }

  // --- ANIMATIONS ---
  if (isMoving) {
    if (currentAnim !== animName && actions[animName]) {
      playAnimation(animName)
    }
    const joystickForce = THREE.MathUtils.clamp(joystick?.force ?? 0, 0.1, 1)
    const speedMultiplier = 1 + joystickForce * (sprint ? sprintMult : 1)
    actions[animName].timeScale = speedMultiplier
  } else {
    if (currentAnim === animName) {
      playAnimation("Bip_Idle")
    }
  }

  if (menuLight.current && !r3fScene.children.includes(menuLight.current.target)) {
    r3fScene.add(menuLight.current.target)
  }

  robotLightGroup.current.position.set(pos.x, pos.y + 30, pos.z)
  robotLight.current.target.position.set(pos.x, pos.y + 1.5, pos.z)
})
  
  return (
    <>
        <group ref={robotLightGroup}>
        <spotLight
          ref={robotLight}
          intensity={10}
          distance={50}
          angle={degrees(180)}
          penumbra={0.5}
          castShadow
          color={'white'}
        />
        </group>
      <group ref={groupRef}>
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
        >


        {toggleOptions && 
        <>
          <group position={[0,1.2,3]}>
            <spotLight color={'deepSkyBlue'} castShadow ref={menuLight} intensity={0.2}/>
          </group>
          <group position={[0,5,0]}>
            <object3D ref={menuLightTarget} position={[0,5,0]}>
            </object3D>
              <mesh>
                <Billboard>
                  <Html
                    scale={0.75}
                    transform
                    position={[-1, 1, 0]} // Relative to mesh center
                    center
                  >
                   <SpeechBubble setToggleOptions={setToggleOptions}/> 
                  </Html>
                </Billboard>
                <boxGeometry args={[3,3,0.01]}/>
                <meshStandardMaterial color={'white'} transparent opacity={0.3} roughness={2} side={THREE.DoubleSide}/>
              </mesh>
          </group>
        </>
        }

        <mesh
          position={[0, 1, 0]}
          onPointerOver={() => setToggleHover(true)}
          onPointerOut={() => setToggleHover(false)}
          onClick={() => setToggleOptions(prev => !prev)}
        >
          <boxGeometry args={[1, 3, 1]} />
          <meshBasicMaterial
            transparent
            opacity={0} // Fully invisible
            depthWrite={false} // Prevents z-buffer issues
          />
        </mesh>
          {addBip && robot}
          <ambientLight color={'deepSkyBlue'} intensity={0.01}/>
          <CuboidCollider
            userData='robot-collider' 
            args={[0.5, 1, 0.5]} 
            position={[0, 1, 0]} 
            collisionGroups={interactionGroups([1], [0, 3])} 
           />
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
