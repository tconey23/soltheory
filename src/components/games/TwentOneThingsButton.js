import { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import Hexagon from './Hexagon';
import { useNavigate } from 'react-router-dom';

const TwentOneThingsButton = ({admin}) => {
    const nav = useNavigate()
  return (
    <Stack onClick={() => {
        
      if(!admin){nav('/21things')}
      
      }} direction={'row'} height={100} justifyContent={'center'} alignItems={'center'}
      sx={{scale: admin ? 0.5 : 1}}
      >  
        <Hexagon dims={100}/>
        <Typography fontSize={50} fontFamily={'Fredoka Regular'}>21Things</Typography>
    </Stack>
  );
};

export default TwentOneThingsButton;