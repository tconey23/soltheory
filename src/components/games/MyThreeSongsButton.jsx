import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import SixPics from '../../assets/SixPics';
import { useNavigate } from 'react-router-dom';

const MyThreeSongsButton = ({admin}) => {
    const nav = useNavigate()
  return (
    <Stack direction={'row'} height={100} width={'100%'} justifyContent={'center'} alignItems={'center'}
        sx={{scale: 0.5}}
        > 
            <img src={'/mythreesongs.gif'} style={{height: '100%', marginRight: '30px'}}/>
            <Typography fontSize={50} fontFamily={'Fredoka Regular'}>3 Songs</Typography>
    </Stack>
  );
};

export default MyThreeSongsButton;