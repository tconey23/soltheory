import { useMemo, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { useIntersect } from '@react-three/drei'

const GroundPlane = ({setGroundReady}) => {
const ref = useIntersect((visible) => {
  if(visible){
    setGroundReady(true)
  }})

    const curvedPlane = useMemo(() => {
      const geometry = new THREE.PlaneGeometry(75, 75, 20, 20)
      geometry.rotateX(-Math.PI / 2)
      geometry.toNonIndexed()
    
      const pos = geometry.attributes.position
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i)
        const z = pos.getZ(i)
        const y = Math.sin((x ** 2 + z ** 2) * 0.001) * 2
        pos.setY(i, y)
      }
    
      pos.needsUpdate = true
      geometry.computeVertexNormals()
    
      return geometry
    }, [])
  
    return (
        <>
            <mesh ref={ref} geometry={curvedPlane} receiveShadow>
                <meshStandardMaterial metalness={1} roughness={0} color={'grey'}/>
            </mesh>
        </>
    )
  }

export default GroundPlane;