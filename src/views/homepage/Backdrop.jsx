import { Environment, Lightformer } from "@react-three/drei"
import { useGlobalContext } from "../../business/GlobalContext"

const Backdrop = ({blur, int, backRot, envRot, res}) => {

  const {degrees} = useGlobalContext()

  return (
    <Environment
      resolution={res}
      preset={null}
      background
      backgroundBlurriness={blur}
      backgroundIntensity={int}
      backgroundRotation={backRot}
      environmentIntensity={0.3}
      environmentRotation={envRot}
      files={'/puresky.hdr'}
    >
      
      <Lightformer visible={false} form="ring" color="rebeccapurple" intensity={100} rotation-x={Math.PI / 2} position={[0, 10, 0]} scale={[10, 1, 1]} />
      <Lightformer visible={false} form="ring" color="limeGreen" intensity={100} rotation-z={degrees(45)} position={[0, 10, 0]} scale={[9, 1, 1]} />
      <Lightformer visible={false} form="ring" color="deepSkyBlue" intensity={80} rotation-z={degrees(-90)} position={[5, 10, 0]} scale={[10, 1, 1]} />
      <Lightformer visible={false} form="ring" color="hotPink" intensity={75} rotation-y={-Math.PI / 2} position={[0, 30, 30]} scale={[100, 2, 1]} />
      <Lightformer visible={false} form="ring" color="red" intensity={5} scale={5} position={[0, 8, 0]} onUpdate={(self) => self.lookAt(0, 0, 0)} />
    </Environment>
  )
}

export default Backdrop