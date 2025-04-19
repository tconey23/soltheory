import { useGLTF } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useAnimations } from '@react-three/drei'

import { useGlobalContext } from '../business/GlobalContext'

const RobotGLB = ({groupRef, isMoving, isSprinting, sprintMult, isTurning, isJumping, setTurnAround, turnAround}) => {
    useGLTF.preload('/AnimatedRobot.glb')
    const { scene, animations } = useGLTF('/AnimatedRobot.glb')
    const [ready, setReady] = useState(false);
    const { actions } = useAnimations(animations, ready ? groupRef : undefined);
    const [robot, setRobot] = useState()
    const spotTarget = useRef()
    const idleTimeoutRef = useRef()
    const waveTimeoutRef = useRef()
    const danceTimeoutRef = useRef()
    const {degrees} = useGlobalContext()
    const [isIdle, setIsIdle] = useState(false)
    const [idleTime, setIdleTime] = useState(0)
    const animWalking = 'Bip_Walking'
    const animRunning = 'Bip_Running'
    const animLeft = 'Bip_LeftTurn'
    const animRight = 'Bip_RightTurn'
    const animJump = 'Bip_Jump'
    const animIdle = 'Bip_Idle'
    const animTurn90 = "Bip_Turn90"
    const animDance = "Bip_TutDance"
    const animWave = "Bip_Waving"

    useEffect(() => {
        if (groupRef.current) setReady(true);
      }, [groupRef]);

      const play = (name, weight = 1, loop = THREE.LoopRepeat, speed = 1) => {
        const action = actions[name];
        if (!action) return;
        action.enabled = true;
        action.setEffectiveWeight(weight);
        action.setLoop(loop);
        action.clampWhenFinished = false;
        action.timeScale = speed;
        action.reset().fadeIn(0.3).play();
      };

    useEffect(() => {
        if (!actions || Object.keys(actions).length === 0) return;

        setIsIdle(false)
      
        Object.values(actions).forEach((action) => {
          if (action && action.isRunning()) {
            action.fadeOut(0.2)
            action.enabled = false}
        });
      
        if (isJumping) {
          play(animJump, 1, THREE.LoopOnce, 1);
          return;
        }
      
        if (isMoving && !isSprinting) {
          play(animWalking, 1, THREE.LoopRepeat, 1);
          return;
        }
      
        if (isMoving && isSprinting) {
          play(animRunning, 1, THREE.LoopRepeat, 1);
          return;
        }
        setIsIdle(true)
      
      }, [isMoving, isSprinting, sprintMult, isJumping, isIdle, actions]);
      

      useEffect(() => {
        if (!actions[animIdle]) return;
      
        if (isIdle) {
          if (!actions[animIdle].isRunning()) {
            play(animIdle, 1, THREE.LoopRepeat, 0.5);
          }
      
          clearTimeout(idleTimeoutRef.current)
      
          idleTimeoutRef.current = setTimeout(() => {
            setTurnAround(true);
          }, 3000000);
        } else {
          setTurnAround(false);
          clearTimeout(idleTimeoutRef.current)
        }
      }, [isIdle]);

      useEffect(() => {
        if (turnAround && actions[animWave] && actions[animDance]) {
          play(animWave, 1, THREE.LoopOnce, 0.5);
      
          const waveAction = actions[animWave];
          waveAction.clampWhenFinished = true;
      
          const mixer = waveAction.getMixer();
      
          const onWaveFinished = (e) => {
            if (e.action === waveAction) {
              play(animDance, 1, THREE.LoopOnce, 1);
              mixer.removeEventListener('finished', onWaveFinished);
            }
          };
      
          mixer.addEventListener('finished', onWaveFinished);
      
          return () => mixer.removeEventListener('finished', onWaveFinished);
        }
      }, [turnAround, actions]);

      useEffect(() => {
        return () => {
          clearTimeout(idleTimeoutRef.current)
          clearTimeout(waveTimeoutRef.current)
          clearTimeout(danceTimeoutRef.current)
        }
      }, []);
      

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
          
          spotlight.position.copy(node.position).add(new THREE.Vector3(0, 0, 0));
          spotlight.target = target;
          spotlight.castShadow = true;
          pointLight.castShadow = true;
          scene.castShadow = true

          spotlight.userdata = 'SpotLight'  
          pointLight.userdata = 'PointLight'
          targetDebug.userdata = 'DebugMesh'
          
          const existingDebug = scene.getObjectByProperty('userdata', 'DebugMesh')
          const existingPoint = scene.getObjectByProperty('userdata', 'PointLight')
          const existingSpot = node.getObjectByProperty('userdata', 'SpotLight')

          node.material.transparent = true
          node.material.opacity = 0.1
          node.material.ior = 1.6
          node.material.side = THREE.DoubleSide
          node.material.transmission = 1
          node.material.thickness = 0.1
          node.material.roughness = 0
          node.material.envMapIntensity = 1.5
          node.material.metalness = 0
          
          if (existingDebug) scene.remove(existingDebug)
          if (existingPoint) scene.remove(existingPoint)
          scene.add(pointLight)
          if (existingSpot) node.remove(existingSpot)
          node.add(spotlight)
          node.add(spotlight.target)
        }
      }
    })
  
    setRobot(
      <group
        ref={groupRef}
       scale={[0.1, 0.1, 0.1]}
      >
        <primitive
         object={scene} 
         />
      </group>
  )
  }, [scene])


  return (
    <>
        {robot && robot}
    </>
  );
};

export default RobotGLB;