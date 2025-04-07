import { useEffect, useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { useGlobalContext } from '../business/GlobalContext';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
    const {returnUrl, setReturnUrl} = useGlobalContext()
    const nav = useNavigate()
    console.log(returnUrl)
  return (
    <Stack direction={'column'} sx={{ height: '98vh', width: '100vw' }}>
      <Typography>This page is still under construction</Typography>
      <Typography>Please check back in later</Typography>
      <Button onClick={() => nav(returnUrl)}>Go Back</Button>
    </Stack>
  );
};

export default ErrorPage;