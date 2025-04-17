import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';

const Lighting = ({pos, lookAt, intensity, xOffset, zOffset, color1, color2}) => {
    
  return (
    <group position={pos} >
        <directionalLight color={color1} position={[pos[0] + xOffset, pos[1], -zOffset]} intensity={intensity} castShadow />
        <directionalLight color={color2} position={[pos[0] - xOffset, pos[1], zOffset]} intensity={intensity} castShadow/>
    </group>
  );
};

export default Lighting;