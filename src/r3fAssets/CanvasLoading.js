import { useEffect, useState, useRef } from 'react';
import { Button, Stack } from '@mui/material';
import { PerspectiveCamera, OrbitControls, Center, Text3D, Box } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber'
import RobotModel from './RobotModel';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three'
import { useGlobalContext } from '../business/GlobalContext';
import LinearProgress from '@mui/material/LinearProgress';
import { Billboard } from '@react-three/drei';
import { Html } from '@react-three/drei';

const degrees = (degrees) => degrees * (Math.PI / 180)

const CanvasLoading = ({progress}) => {
    const {font} = useGlobalContext()

    const [currentRotation, setCurrentRotation] = useState(0)
    const [text, setText] = useState('Loading Scene')
    const [textDec, setTextDec] = useState('...')
    const [dots, setDots] = useState(0)
    const [buffer, setBuffer] = useState(10)

    const robot = useRef()

    useEffect(() => {
        console.log(progress)
    }, [progress])

    useEffect(() => {
        const interval = setInterval(() => {
          setDots(prev => (prev + 1) % 4)
        }, 500)
        return () => clearInterval(interval)
      }, [])
      
      useEffect(() => {
        setTextDec('.'.repeat(dots))
      }, [dots])


    useEffect(() =>{
        // console.log(currentRotation)
        if(currentRotation >= 360){
            setCurrentRotation(0)
        }
    }, [currentRotation])


    useFrame(() =>{
        setCurrentRotation(prev => prev +0.9)
    })

  return (
    <group position={[0,-1,-3]}>
        <directionalLight color={'deepskyblue'} castShadow intensity={30} position={[5,4,0]}/>
        <directionalLight color={'violet'} castShadow intensity={30} position={[-5,4,0]}/>
        <group ref={robot}>
            <RobotModel bodyRef={null} joystick={null} pos={[0,0,3.9]} rot={degrees(currentRotation)}/>
        </group>
        <group position={[0,-3.5,0]}>
        <Html center transform distanceFactor={10}>
            <Stack width={300} justifyContent={'center'}>
                    <LinearProgress variant="buffer" value={progress} valueBuffer={buffer} />
                <Stack marginTop={2} width={300} alignItems={'center'}>
                    <Box>
                        <Button variant='contained'>{`${progress}%`}</Button>
                    </Box>
                </Stack>
            </Stack>
        </Html>
        </group>
        <group position={[0,-2,0]}>
            <Center>
                <Text3D
                font={font}
                    size={0.5}
                    height={0.05}
                    curveSegments={64}
                    bevelEnabled
                    bevelThickness={0.02}
                    bevelSize={0.02}
                    bevelOffset={0}
                    bevelSegments={8}
                    castShadow
                >
                    {`${text}`}
                </Text3D>
            </Center>
        </group>
        <group position={[2.35,-2.15,0]}>
                <Text3D
                        font={font}
                        size={0.5}
                        height={0.05}
                        curveSegments={64}
                        bevelEnabled
                        bevelThickness={0.02}
                        bevelSize={0.02}
                        bevelOffset={0}
                        bevelSegments={8}
                        castShadow
                    >
                        {`${textDec}`}
                    </Text3D>
        </group>

    </group>
  );
};

export default CanvasLoading;