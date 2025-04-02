import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const CameraFollow = ({ targetRef, offset = new THREE.Vector3(0, 5, -10) }) => {
  const { camera } = useThree()
  const camTarget = new THREE.Vector3()
  const desiredPosition = new THREE.Vector3()

  useFrame(() => {
    if (!targetRef.current) return

    const pos = targetRef.current.translation()
    const ballPosition = new THREE.Vector3(pos.x, pos.y, pos.z)

    // Fixed offset relative to world space
    desiredPosition.copy(ballPosition).add(offset)

    // Smoothly move camera
    camera.position.lerp(desiredPosition, 0.1)

    // Always look at the ball
    camTarget.set(pos.x, pos.y + 1, pos.z)
    camera.lookAt(camTarget)
  })

  return null
}

export default CameraFollow
