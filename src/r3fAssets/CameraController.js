import { CameraControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'

let controls

const CameraFollow = ({ targetRef }) => {
  const { camera, gl } = useThree()
  const controlsRef = useRef()

  useEffect(() => {
    controls = controlsRef.current
    controls.setLookAt(0, 5, 10, 0, 1, 0)
  }, [])

  useFrame(() => {
    if (!targetRef.current || !controls) return
  
    const pos = targetRef.current.translation()
    const vel = targetRef.current.linvel()
  
    const dynamicOffset = new THREE.Vector3().copy(vel).multiplyScalar(0.2).negate()
    const staticOffset = new THREE.Vector3(-1, 3.5, 5)
    const offset = dynamicOffset.add(staticOffset)
  
    const camPos = new THREE.Vector3(pos.x, pos.y, pos.z+2).add(offset)
    const lookAt = new THREE.Vector3(pos.x, pos.y + 2, pos.z)
  
    controls.setLookAt(camPos.x, camPos.y, camPos.z, lookAt.x, lookAt.y, lookAt.z, true)
  })

  return <CameraControls ref={controlsRef} />
}

export default CameraFollow
