import { useThree } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'

const LightWeightCamControl = () => {
  const { camera } = useThree()

  let z = 19

  useFrame(() => {
      if(camera){
          // camera.lookAt(-150, 2, z)
          // camera.position.set(25,11.1, z)

          camera.lookAt(-150, 2, z)
          camera.position.set(25,11.1, z)
      }
  })

  return null
}

export default LightWeightCamControl