import { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';

const InProgress = () => {
  return (
    <Stack direction={'column'} width={'100%'} height={'100%'}>
        <Typography>This feature is currently unavailable</Typography>
        <i style={{color: 'gold', fontSize: 30}} className="fi fi-sr-digging"></i>
        <Typography>Check back in later</Typography>
    </Stack>
  );
};

export default InProgress;