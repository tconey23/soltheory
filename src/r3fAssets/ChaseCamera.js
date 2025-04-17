import { CameraControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useGlobalContext } from '../business/GlobalContext'

const ChaseCamera = ({ targetRef, turnAround, setControlsRef }) => {
  const { isMobile } = useGlobalContext()
  const { camera } = useThree()
  const controlsRef = useRef()
  const currentZOffset = useRef(-8)
  const currentPos = useRef(new THREE.Vector3())
  const currentLook = useRef(new THREE.Vector3())

  useEffect(() => {
    setControlsRef(controlsRef)
  }, [setControlsRef])

  useEffect(()=>{
    if(camera){
      camera.fov = isMobile ? 105 : 75
      camera.updateProjectionMatrix()
    }
  }, [camera, isMobile])

  useFrame((_, delta) => {
    if (!targetRef.current || !controlsRef.current) return
  
    const yOffset = isMobile ? 3 : 1
    const controls = controlsRef.current
    const pos = targetRef.current.translation()
    const rot = targetRef.current.rotation()
    const quat = new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w)
  
    // Smoothly interpolate Z offset
    const targetZ = turnAround ? 8 : -8
    currentZOffset.current = THREE.MathUtils.lerp(currentZOffset.current, targetZ, 0.05)
  
    const offset = new THREE.Vector3(0, 3.5, currentZOffset.current).applyQuaternion(quat)
  
    const desiredPos = new THREE.Vector3(pos.x, pos.y + yOffset, pos.z).add(offset)
    const desiredLook = new THREE.Vector3(pos.x, pos.y + 2.5, pos.z)
  
    currentPos.current.lerp(desiredPos, 0.1)
    currentLook.current.lerp(desiredLook, 0.1)
  
    controls.setLookAt(
      currentPos.current.x,
      currentPos.current.y,
      currentPos.current.z,
      currentLook.current.x,
      currentLook.current.y,
      currentLook.current.z,
      false
    )
  
    controls.enabled = false
    controls.update(delta)
  })

  return <CameraControls ref={controlsRef} />
}

export default ChaseCamera
