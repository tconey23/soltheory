import { CameraControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'

let controls

const CameraFollow = ({ targetRef, turnAround, setTurnAround }) => {
  const { camera, gl } = useThree()
  const controlsRef = useRef()

  useEffect(() => {
    controls = controlsRef.current
    controls.setLookAt(0, 5, 10, 0, 1, 0)
  }, [])

  useFrame(() => {
    if (!targetRef.current || !controls) return;
  
    const pos = targetRef.current.translation();
    const rot = targetRef.current.rotation(); // This gives a quaternion
    const quaternion = new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w);
  
    // Define the camera offset (behind and above)
    const offset = new THREE.Vector3(0, 3.5, turnAround ? 6 : -8); // behind = -Z
  
    // Rotate offset relative to the robot's orientation
    offset.applyQuaternion(quaternion);
  
    // Calculate camera position by applying offset to robot position
    const camPos = new THREE.Vector3(pos.x, pos.y, pos.z).add(offset);
  
    // Look slightly above robot
    const lookAt = new THREE.Vector3(pos.x, pos.y + 1.5, pos.z);
  
    controls.setLookAt(camPos.x, camPos.y, camPos.z, lookAt.x, lookAt.y, lookAt.z, true, 0.1);
  });

  return <CameraControls ref={controlsRef} />
}

export default CameraFollow
