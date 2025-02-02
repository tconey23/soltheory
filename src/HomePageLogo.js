import React from 'react'
import HomePageText from './r3fAssets/HomePageText'
import Rings from './r3fAssets/Rings'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

const HomePageLogo = () => {

  const logoRef = useRef()

  useFrame(() => {
    if(logoRef.current){
      // logoRef.current.rotation.z += 0.005
    }
  })

  const degrees = (degrees) => degrees * (Math.PI / 180)
  return (
    <group ref={logoRef} rotation={[degrees(90),0,degrees(-25)]}>
      <HomePageText />
      <Rings />
    </group>
  )
}

export default HomePageLogo
