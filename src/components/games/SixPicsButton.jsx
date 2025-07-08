import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import SixPics from '../../assets/SixPics';
import { useNavigate } from 'react-router-dom';

const SixPicsButton = ({admin, scl}) => {
    const nav = useNavigate()
  return (
    <Stack direction={'row'} height={100} width={'100%'} justifyContent={'center'} alignItems={'center'}
        sx={{scale: scl || 0.5}}
        > 
        <Box sx={{padding: 2}}>
          <img style={{width: '170px'}} src={'/6pics_logo.png'}/>
        </Box>
        <Typography fontSize={50} fontFamily={'Fredoka Regular'}>6 Pics</Typography>
    </Stack>
  );
};

export default SixPicsButton;