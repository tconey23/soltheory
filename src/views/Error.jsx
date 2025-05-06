import { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

const Error = () => {
    const loc = useLocation()
    console.log(loc)
  return (
    <Stack direction={'column'} width={'100%'} height={'100%'} sx={{bgcolor: '#f4f6f8',}}>
      <Typography sx={{bgcolor: '#f4f6f8',}}>ERROR</Typography>
      <Typography sx={{bgcolor: '#f4f6f8',}}>THIS PAGE DOESN'T EXIST</Typography>
    </Stack>
  );
};

export default Error;