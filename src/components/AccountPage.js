import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import {Avatar} from '@mui/material';
import {Typography} from '@mui/material';
import {Button} from '@mui/material';
import Admin from './Admin';
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { getUser } from '../business/apiCalls';
import { useGlobalContext } from '../business/GlobalContext'

const AccountPage = ({user, handleLogout, size}) => {
    const {alertProps, setAlertProps} = useGlobalContext()

    const [isAdmin, setisAdmin] = useState(false)

    const checkAdminAccess = async (email) => {
        const res = await getUser(email)
        if(res.is_admin){
            setisAdmin(true)
        }
    }

useEffect(() => {
    if(user && user.email){
        checkAdminAccess(user.email)
    }
    console.log(user)
}, [user])

  return (
        <Stack direction={'column'} sx={{ height: '100%', width: '100%'}} justifyContent={'flex-start'} alignItems={'flex-start'}>
                <Stack width={'100%'} height={'100%'} justifyContent={'flex-start'} alignItems={'center'} sx={{resize: 'both'}}>
                    <Stack width={'20%'} justifyContent={'center'} alignItems={'center'} padding={1} margin={2}>
                        <Avatar sx={{ width: 50, height: 50, mb: 2 }} />
                        <Typography variant="h7">Welcome, {user?.email || "User"}!</Typography>
                        <Button variant="contained" color="error" onClick={handleLogout} sx={{ mt: 2 }}>
                            Logout
                        </Button>
                    </Stack>
                    <Stack height={'100%'} width={'95%'} justify-content={'space-evenly'}>
                        {/* <Button variant='contained'>My Games</Button>
                        <Button variant='contained'>My Friends</Button> */}
                        {isAdmin && <Admin size={size}/>}
                    </Stack>
                </Stack>
        </Stack>
  );
};

export default AccountPage;