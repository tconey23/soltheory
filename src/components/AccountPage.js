import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import {Avatar} from '@mui/material';
import {Typography} from '@mui/material';
import {Button} from '@mui/material';
import Admin from './Admin';
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";


const AccountPage = ({user, handleLogout, size}) => {

  return (
        <Stack direction={'column'} sx={{ height: '100%', width: '100%'}} justifyContent={'flex-start'} alignItems={'flex-start'}>
                <Stack width={'100%'} height={'100%'} justifyContent={'flex-start'} alignItems={'center'} sx={{resize: 'both'}}>
                    <Stack width={'20%'} justifyContent={'center'} alignItems={'center'} padding={1} margin={2}>
                        <Avatar sx={{ width: 50, height: 50, mb: 2 }} />
                        <Typography variant="h7">Welcome, {user.email || "User"}!</Typography>
                        <Button variant="contained" color="error" onClick={handleLogout} sx={{ mt: 2 }}>
                            Logout
                        </Button>
                    </Stack>
                    <Stack height={'100%'} width={'95%'} justify-content={'space-evenly'}>
                        {/* <Button variant='contained'>My Games</Button>
                        <Button variant='contained'>My Friends</Button> */}
                        <Admin size={size}/>
                    </Stack>
                </Stack>
        </Stack>
  );
};

export default AccountPage;