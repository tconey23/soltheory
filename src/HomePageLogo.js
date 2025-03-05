import React from 'react'
import HomePageText from './r3fAssets/HomePageText'
import Rings from './r3fAssets/Rings'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

const HomePageLogo = ({text}) => {

  const logoRef = useRef()

  useFrame(() => {
    if(logoRef.current){
      // logoRef.current.rotation.z += 0.005
    }
  })

  const degrees = (degrees) => degrees * (Math.PI / 180)
  return (
    <group ref={logoRef} position={[1,0,0]} rotation={[degrees(90),0,degrees(-25)]}>
      <HomePageText text={text}/>
      <Rings />
    </group>
  )
}

export default HomePageLogo
