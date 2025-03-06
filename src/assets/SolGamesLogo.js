import { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { Canvas } from '@react-three/fiber'
import HomePageText from '../r3fAssets/HomePageText';

const SolGamesLogo = () => {

    const purple = '#c956ff'
    const yellow = '#fff200'
    const green = '#45d500'

    const [text, setText] = useState('SolGames')

  return (
    <Stack direction={'column'} sx={{ height: '10vh', width: '45vw' }}>
        <Canvas style={{overflowX: 'visible'}}>
            <ambientLight intensity={0.5} />
            <directionalLight color={purple} intensity={50} position={[2,0,1]} />
            <directionalLight color={green} intensity={50} position={[1,2,1]} />
            <directionalLight color={yellow} intensity={50} position={[1,3,1]} />
            {/* <directionalLight intensity={40} position={[1,0,1]} /> */}

            <HomePageText text={text}/> 
        </Canvas>
    </Stack>
  );
};

export default SolGamesLogo;