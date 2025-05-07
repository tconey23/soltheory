import { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import SixPics from '../../assets/SixPics';
import { useNavigate } from 'react-router-dom';

const SixPicsButton = ({admin}) => {
    const nav = useNavigate()
  return (
    <Stack direction={'row'} height={100} width={'100%'} justifyContent={'center'} alignItems={'center'}
        sx={{scale: 0.5}}
        > 
        <SixPics dims={100}/>
        <Typography fontSize={50} fontFamily={'Fredoka Regular'}>6Pics</Typography>
    </Stack>
  );
};

export default SixPicsButton;