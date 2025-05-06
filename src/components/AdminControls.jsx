import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import Error from '../views/Error';
import InProgress from '../ui_elements/InProgress';

const AdminControls = () => {
  return (
    <Stack direction={'column'} width={'100%'} height={'100%'}>
      <InProgress />
    </Stack>
  );
};

export default AdminControls;