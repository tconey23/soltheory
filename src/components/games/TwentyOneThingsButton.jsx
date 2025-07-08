import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import Hexagon from './Hexagon';
import { useNavigate } from 'react-router-dom';

const TwentOneThingsButton = ({admin, scl}) => {
    const nav = useNavigate()
  return (
    <Stack 
        // onClick={() => {nav('/21things')}} 
        direction={'row'} height={100} justifyContent={'center'} alignItems={'center'} width={'100%'}
        sx={{scale: scl || 0.5}}
    >  
    <Box sx={{paddingX: 2}}>
        <Hexagon dims={100}/>
    </Box>
        <Typography fontSize={50} fontFamily={'Fredoka Regular'}>21 Things</Typography>
    </Stack>
  );
};

export default TwentOneThingsButton;