import { useEffect, useState } from 'react';
import { CircularProgress, Stack } from '@mui/material';

const LoadingScreen = () => {
  return (
    <Stack direction={'column'} sx={{ height: '98%', width: '98%' }} justifyContent={'center'} alignItems={'center'}>
        <CircularProgress />
    </Stack>
  );
};

export default LoadingScreen;