import { useEffect, useState } from 'react';
import { RenderTexture, PerspectiveCamera } from '@react-three/drei'
import { useGlobalContext } from '../business/GlobalContext';
import CameraController from './CameraController';

const Portal = ({ children }) => {

    const {degrees} = useGlobalContext()

    return (
      <mesh rotation={[degrees(0), degrees(180), degrees(0)]} >
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial>
          <RenderTexture attach="map" width={1920} height={1080} samples={40}>
            <CameraController pos={[0,10,-30]} lookAt={[0,0,0]} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            {children}
          </RenderTexture>
        </meshBasicMaterial>
      </mesh>
    );
  };

export default Portal;