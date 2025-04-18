import { useRef } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import { PerspectiveCamera } from "@react-three/drei"
import * as THREE from 'three'

const CameraController = ({ pos, lookAt }) => {
  const cameraRef = useRef()
  const targetPos = new THREE.Vector3(...pos)
  const targetLook = new THREE.Vector3(...lookAt)

  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.position.lerp(targetPos, 0.1)
      cameraRef.current.lookAt(targetLook)
    }
  })

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      fov={75}
      near={0.1}
      far={1000}
    />
  )
}

export default CameraController
