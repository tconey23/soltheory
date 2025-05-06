import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { useIntersect } from '@react-three/drei'
import { useRef } from "react"

const Lighting = ({pos, lookAt, intensity, xOffset, zOffset, color1, color2, setLightingReady}) => {
  // const ref = useIntersect((visible) => {
  //   if(visible){
  //     setLightingReady(true)
  //   }})

  return (
    <mesh position={pos} >
        <directionalLight color={color1} position={[pos[0] + xOffset, pos[1], -zOffset]} intensity={intensity} castShadow />
        <directionalLight color={color2} position={[pos[0] - xOffset, pos[1], zOffset]} intensity={intensity} castShadow/>
    </mesh>
  );
};

export default Lighting;