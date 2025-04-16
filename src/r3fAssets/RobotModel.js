import { useEffect, useRef, useState } from 'react'
import { RigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CuboidCollider } from '@react-three/rapier'
import { interactionGroups } from '@react-three/rapier'
import { useRapier } from '@react-three/rapier'
import { useCursor } from '@react-three/drei'
import SpeechBubble from './SpeechBubble'
import { useGlobalContext } from '../business/GlobalContext'
import RobotGLB from './RobotGLB'
import * as RAPIER from '@dimforge/rapier3d-compat'

const RobotModel = ({ bodyRef, joystick, pos, rot, setTurnAround, turnAround}) => {

  const {setShowJoystick, showJoystick, isMobile, degrees} = useGlobalContext()

  const rapier = useRapier();
  const { world } = rapier
  
  const groupRef = useRef()
  const yawRef = useRef(0)
  const lastRotationRef = useRef(new THREE.Quaternion())
  const keys = useRef({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
    ShiftLeft: false
  })
  
  const [speed] = useState(200)
  const [sprintMult] = useState(3)
  const [isSprinting, setIsSprinting] = useState(false)
  const [toggleOptions, setToggleOptions] = useState(false)
  const [toggleHover, setToggleHover] = useState(false)
  const [isMoving, setIsMoving] = useState(false)
  const [isTurning, setIsTurning] = useState(false)
  const [isJumping, setIsJumping] = useState(false)
  const [isGrounded, setIsGrounded] = useState(true)

  const mouseSensitivity = 0.002
  
  useCursor(toggleHover, /*'pointer', 'auto', document.body*/)

  useEffect(() => {
    if (isJumping && isGrounded && bodyRef.current) {
      console.log('in here')
      const jumpImpulse = new THREE.Vector3(0, 15, 0);
      bodyRef.current.applyImpulse(jumpImpulse, true);
      console.log(bodyRef.current.translation().y)
      setIsJumping(false);       // prevent double-jumps
      setIsGrounded(false);      // will be reset on land
    }
  }, [isJumping, isGrounded, bodyRef]);

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
    let lastYaw = yawRef.current
    let idleTimeout = null
  
    const handleMouseMove = (e) => {
      if (!isMobile) {
        const newYaw = yawRef.current - e.movementX * mouseSensitivity
  
        if (newYaw > lastYaw) {
          setIsTurning('left')
        } else if (newYaw < lastYaw) {
          setIsTurning('right')
        }
  
        yawRef.current = newYaw
        lastYaw = newYaw

        clearTimeout(idleTimeout)
        idleTimeout = setTimeout(() => {
          setIsTurning(false)
        }, 200)
      }
    }
  
    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(idleTimeout)
    }
  }, [isMobile, mouseSensitivity])

  useEffect(() => {
    setTimeout(() => {
      // setToggleOptions(true)
    }, 3000);
  }, [])  

  useFrame(() => {
    if (!bodyRef?.current || !groupRef.current) return;
  
    let impulse = new THREE.Vector3();
    let tiltX = 0;
    let tiltZ = 0;
  
    const up = keys.current['ArrowUp'] || keys.current['KeyW'];
    const down = keys.current['ArrowDown'] || keys.current['KeyS'];
    const left = keys.current['ArrowLeft'] || keys.current['KeyA'];
    const right = keys.current['ArrowRight'] || keys.current['KeyD'];
    const jump = keys.current['Space'];
    const sprint = keys.current['ShiftLeft'];
    const mult = sprint ? sprintMult : 1;
  
    setIsSprinting(sprint);
  
    const moveDirection = new THREE.Vector3();
  
    if (isMobile && joystick?.force > 0) {
      impulse.x += Math.cos(joystick.angle) * joystick.force * speed;
      impulse.z += -Math.sin(joystick.angle) * joystick.force * speed;
    } else {
      if(jump){
        setIsJumping(true)
      } else {
        setIsJumping(false)
      }
      if (up) moveDirection.z += 1;
      if (down) moveDirection.z -= 1;
      if (left) moveDirection.x += 1;
      if (right) moveDirection.x -= 1;
  
      if (moveDirection.lengthSq() > 0) {
        moveDirection.normalize();
        const yawQuat = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(0, yawRef.current, 0)
        );
        moveDirection.applyQuaternion(yawQuat);
        impulse.copy(moveDirection.multiplyScalar(speed * mult));
      }
    }

  
    // Determine movement state
    setIsMoving(impulse.lengthSq() > 0);

    if (isJumping) {
      bodyRef.current.applyImpulse(new THREE.Vector3(0, 2000, 0), true)
    } 

    // Compute rotation even if not moving
    let rotationQuat;
  
    if (isMobile && joystick?.force > 0) {
      const angle = Math.atan2(
        joystick.force * Math.sin(joystick.angle),
        joystick.force * Math.cos(joystick.angle)
      );
      rotationQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(degrees(tiltX), angle, degrees(tiltZ))
      );
    } else {
      rotationQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0, yawRef.current, 0)
      );
    }
  
    // Apply rotation always
    lastRotationRef.current.copy(rotationQuat);
    bodyRef.current.setRotation(rotationQuat, true);
  
    // Apply impulse only if moving
    if (impulse.lengthSq() > 0) {
      bodyRef.current.applyImpulse(impulse, true);
    }
  
    // Optional: speed-based effects
    if (isMoving) {
      const joystickForce = THREE.MathUtils.clamp(joystick?.force ?? 1, 0.1, 1);
    }
  });
  
  
  
  return (
    <>
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
          <group position={[0,5,0]}>
                   <SpeechBubble setToggleOptions={setToggleOptions}/>   
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
            opacity={0} 
            depthWrite={false} 
          />
        </mesh>
          <RobotGLB turnAround={turnAround} setTurnAround={setTurnAround} groupRef={groupRef} isMoving={isMoving} isSprinting={isSprinting} sprintMult={sprintMult} isTurning={isTurning} isJumping={isJumping} />
          <ambientLight color={'deepSkyBlue'} intensity={0.01}/>
          <CuboidCollider
            userData='robot-collider' 
            args={[0.5, 1, 0.5]} w
            position={[0, 1, 0]} 
            collisionGroups={interactionGroups([1], [0, 3])} 
          />
          <CuboidCollider
            userData='robot-sensor' 
            sensor 
            args={[0.5, 1, 0.5]} 
            position={[0, 1, 0]} 
            onIntersectionEnter={(other) => {
              const isGround = other.rigidBody.userData === 'ground_plane'
              if(isGround && !isGrounded){
                setIsGrounded(true)
              }
            }}
            onIntersectionExit={(other) => {
              const isGround = other.rigidBody.userData === 'ground_plane'
              if(isGround && isGrounded){
                setIsGrounded(false)
              }
            }}
           />
        </RigidBody>
        : 
        <group position={pos} rotation={[degrees(0), rot > 0 ? rot : degrees(0), degrees(0)]} >
          <RobotGLB groupRef={groupRef}/>
        </group>  
      }
      </group>
    </>
  )
}

export default RobotModel
