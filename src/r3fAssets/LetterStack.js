import { useEffect, useRef, useState } from 'react'
import { Billboard, Center, Html, MeshWobbleMaterial, Text, Text3D } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'
import { Slider, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { useGlobalContext } from '../business/GlobalContext'
import { interactionGroups } from '@react-three/rapier'

const degrees = (degrees) => degrees * (Math.PI / 180)

const Hexagon = ({ radius = 1.5, depth = 0.5, ...props }) => {
  const shape = useMemo(() => {
    const hex = new THREE.Shape()
    const angleStep = (Math.PI * 2) / 6
    hex.moveTo(Math.cos(0) * radius, Math.sin(0) * radius)
    for (let i = 1; i <= 6; i++) {
      hex.lineTo(Math.cos(i * angleStep) * radius, Math.sin(i * angleStep) * radius)
    }
    return hex
  }, [radius])

  const extrudeSettings = {
    depth,
    bevelEnabled: false
  }

  const geometry = useMemo(() => new THREE.ExtrudeGeometry(shape, extrudeSettings), [shape, depth])

  return (
    <mesh geometry={geometry} {...props} castShadow receiveShadow position={[0,0.8,-1]} >
      <meshStandardMaterial color="orange" emissive="orange" emissiveIntensity={0.01} toneMapped={false} transparent opacity={props.opac}/>
    </mesh>
  )
}

const LetterStack = ({ lt, def }) => {
  const [font] = useState("/fonts/Fredoka_Regular.json")
  const letterRefs = useRef([])
  const boxRefs = useRef([])
  const [letterBoxes, setLetterBoxes] = useState([])
  const [largestBox, setLargestBox] = useState([1, 1, 1])
  const [refreshColl, setRefreshColl] = useState(1)
  const [collDetected, setCollDetected] = useState(false)
  const [reset, setReset] = useState(false)
  const [toggleDef, setToggleDef] = useState(false)
  const [hexOpac, setHexOpac] = useState(0)
  const [opts, setOpts] = useState({
    font: "Philosopher",
    fontSize: 12,
    color: "#99ccff",
    maxWidth: 300,
    lineHeight: 1,
    letterSpacing: 0,
    textAlign: "justify",
    materialType: "MeshStandardMaterial",
  });

  const boxSize = [1, 1.2, 0.5]

  const {speed, setSpeed} = useGlobalContext()

  const billBoardRef = useRef()

  const boxOpac = useRef(0.3)
  const letterOpac = useRef(1)
  const textOpac = useRef(0)

  const targetOpacity = 1

  useEffect(() =>{
    
  }, [billBoardRef])

  const LETTER_GROUP = 0b0001
  const LETTER_MASK = 0b1111

  useFrame(() => {

    if (toggleDef && billBoardRef.current && textOpac.current < targetOpacity) {
      textOpac.current += 0.01
      billBoardRef.current?.traverse((child) => {
        if (child.isMesh && child.material?.transparent) {
          child.material.opacity = textOpac.current
          setHexOpac(textOpac.current)
        }
      })
    }
  
    // Fading out
    if (!toggleDef && billBoardRef.current && textOpac.current > 0) {
      textOpac.current -= 0.01
      billBoardRef.current?.traverse((child) => {
        if (child.isMesh && child.material?.transparent) {
          child.material.opacity = textOpac.current
          setHexOpac(textOpac.current)
        }
      })
    }

    if (collDetected && boxOpac.current > -10 && letterOpac.current > -10 && !reset) {
      boxOpac.current -= 0.001
      letterOpac.current -= 0.01
  
      boxRefs.current.forEach((ref) => {
        if (ref?.material) {
          ref.material.opacity = Math.max(0, boxOpac.current)
        }
      })
  
      letterRefs.current.forEach((ref) => {
        if (ref?.material) {
          ref.material.opacity = Math.max(0, letterOpac.current)
        }
      })
    }

    if(letterOpac.current < 0 && boxOpac.current < 0 && !reset){
      letterOpac.current = 1
      boxOpac.current = 0.3
      setCollDetected(false)
      setReset(true)
    }
  })

  useEffect(() => {
  }, [letterOpac, boxOpac])

  useEffect(() => {
    if(reset){
      setRefreshColl(prev => prev +1)
      setReset(false)
    }
  }, [reset])

  useEffect(() => {
    const timeout = setTimeout(() => {
      const newBoxes = lt.split('').map((_, i) => {
        const ref = letterRefs.current[i]
        if (!ref) return null

        const box = new THREE.Box3().setFromObject(ref)
        const size = new THREE.Vector3()
        box.getSize(size)
        return { size }
      })
      setLetterBoxes(newBoxes)
    }, 100)

    return () => clearTimeout(timeout)
  }, [lt])

  useEffect(() => {
    let mult = 1.2
    if (letterBoxes.length > 0) {
      const maxDims = letterBoxes.reduce(
        (acc, curr) => [
          Math.max(acc[0], curr?.size?.x * mult || 0),
          Math.max(acc[1], curr?.size?.y * mult || 0),
          Math.max(acc[2], curr?.size?.z * mult || 0)
        ],
        [0, 0, 0]
      )
      setLargestBox(maxDims)
    }
  }, [letterBoxes])

  useEffect(() => {
    if(largestBox[0] !== 1 && largestBox[1] !== 1 && largestBox[2] !== 1){
        setRefreshColl(prev => prev +1)
    }
  }, [largestBox])

  return (
    <group key={refreshColl}>
      {/* Sensor Zone to Trigger Billboard Fade */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider
          sensor
          args={[1, 10, 1.8]}
          position={[largestBox[0] / 2.3, 0.5, 1]}
          onIntersectionEnter={(target) => {
            if (target.rigidBody.userData === 'robot-mesh') setToggleDef(true)
          }}
          onIntersectionExit={(target) => {
            if (target.rigidBody.userData === 'robot-mesh') setToggleDef(false)
          }}
        />
      </RigidBody>
  
      {/* Billboard Definition Display */}
      <Billboard position={[0.4, 5, 0]}>
        <group ref={billBoardRef}>
          <Hexagon opac={hexOpac} />
          <mesh position={[0, 0, -0.25]}>
            <Text
              font={font}
              size={0}
              text={def}
              anchorX="center"
              anchorY="bottom"
              maxWidth={2}
              textAlign="center"
              whiteSpace="normal"
              overflowWrap="normal"
              fontSize={0.4}
            >
              <meshStandardMaterial
                emissive="deepSkyBlue"
                emissiveIntensity={0.2}
                toneMapped={true}
                attach="material"
                color={opts.color}
                transparent
                opacity={0}
              />
            </Text>
          </mesh>
        </group>
      </Billboard>
  
      {/* Letter Stack */}
      {lt.split('').reverse().map((char, i) => (
  <RigidBody
    key={i}
    userData="letter"
    type="dynamic"
    position={[0.5, i * 1.3, 0]}
    colliders={false}
    restitution={0.01}
    friction={1}
    mass={1}
    linearDamping={0.05}
    angularDamping={0.1}
    collisionGroups={interactionGroups([0], [0,1,2,3])}
    onCollisionEnter={({ other }) => {
      if (other.rigidBody.userData === 'robot-mesh') {
        setTimeout(() => setCollDetected(true), 5000)
      }
    }}
  >
    {/* Physics Mesh */}
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 1.2, 0.5]} />
      <meshStandardMaterial color="skyblue" transparent opacity={0.3} />
    </mesh>

    {/* Physics Collider */}
    <CuboidCollider
      args={[0.5, 0.6, 0.25]} // half extents
      position={[0, 0, 0]}
      collisionGroups={interactionGroups([0], [0,1,2,3])}
    />

    {/* Centered Text3D */}
    <Center> {/* center in all axes */}
      <Text3D
        ref={(el) => (letterRefs.current[i] = el)}
        font={font}
        size={1}
        height={0.4}
        curveSegments={64}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={8}
      >
        {char}
        <MeshWobbleMaterial
          factor={0.05}
          speed={speed}
          color="white"
          transparent
          opacity={1}
          emissive="white"
          emissiveIntensity={0.3}
          toneMapped={false}
        />
        <pointLight intensity={0.05} color="white" />
      </Text3D>
    </Center>
  </RigidBody>
))}

    </group>
  )
}

export default LetterStack
