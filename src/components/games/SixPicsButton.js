import { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import SixPics from '../../assets/SixPics';
import { useNavigate } from 'react-router-dom';

const SixPicsButton = ({admin}) => {
    const nav = useNavigate()
  return (
    <Stack onClick={() => {
        
        if(!admin){nav('/6pics')}
        
        }} direction={'row'} height={100} justifyContent={'center'} alignItems={'center'}
        sx={{scale: admin ? 0.5 : 1}}
        > 
        <SixPics dims={100}/>
        <Typography fontSize={50} fontFamily={'Fredoka Regular'}>6Pics</Typography>
    </Stack>
  );
};

export default SixPicsButton;