import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import InProgress from '../ui_elements/InProgress';

const AvatarForm = () => {
  return (
    <Stack direction={'column'} width={'100%'} height={'100%'}>
      <InProgress />
    </Stack>
  );
};

export default AvatarForm;