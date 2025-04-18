import { useEffect, useState } from 'react';
import { useMemo } from 'react'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { TrimeshCollider } from '@react-three/rapier'
import { Environment, Lightformer } from '@react-three/drei';
import { useGlobalContext } from '../business/GlobalContext';


const GroundPlane = ({showEnvironment}) => {
    const curvedPlane = useMemo(() => {
      const geometry = new THREE.PlaneGeometry(100, 100, 100, 100)
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
  
    const textures = useTexture({
      map: '/ground_texture/BaseColor.png',
      aoMap: '/ground_texture/AmbientOcclusion.jpg',
      displacementMap: '/ground_texture/Displacement.png',
      metalnessMap: '/ground_texture/Metallic.png',
      normalMap: '/ground_texture/Normal.png',
      roughnessMap: '/ground_texture/Roughness.png',
    })
  
    useEffect(() => {
      Object.values(textures).forEach((tex) => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping
        tex.repeat.set(10, 10) // Less dense than 300x300 for better lighting
        tex.anisotropy = 16
      })
    }, [textures])
  
    return (
      <>
        <RigidBody userData='ground_plane' type="fixed" colliders={false} friction={1}>
          <mesh geometry={curvedPlane} receiveShadow>
            <meshStandardMaterial {...textures} metalness={1} roughness={1.5} />
          </mesh>
          <TrimeshCollider

        position={[0,0.55,0]}
        args={[
        Array.from(curvedPlane.attributes.position.array),
        Array.from(curvedPlane.index?.array ?? []), // must exist, so fallback to []    
        ]}
        />
        </RigidBody>
    </>
    )
  }

export default GroundPlane;