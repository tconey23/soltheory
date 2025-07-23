import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import SixPics from '../../assets/SixPics';
import { useNavigate } from 'react-router-dom';

const WavetunerButton = ({admin}) => {
    const nav = useNavigate()
  return (
    <Stack direction={'row'} height={100} width={'100%'} justifyContent={'center'} alignItems={'center'}
        sx={{scale: 0.5}}
        > 
        <Box sx={{padding: 2}}>
          <img width='100px' height='auto' src='/meditation.gif'/>
        </Box>
        <Typography fontSize={50} fontFamily={'Fredoka Regular'}>SOL Vibes</Typography>
    </Stack>
  );
};

export default WavetunerButton;