import { useEffect, useState } from 'react';
import { Avatar, Button, FormControl, Input, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { updatePassword, updateUserName } from '../business/supabase_calls';
import useGlobalStore from '../business/useGlobalStore';

const Password = () => {
    const [newPassword, setNewPassword] = useState()
    const [confPassword, setConfPassword] = useState()
    const [match, setMatch] = useState(false)
    const [toggleShowPassword, setToggleShowPassword] = useState(false)

    useEffect(() => {
        if(newPassword && confPassword && newPassword === confPassword){
            setMatch(true)
        }
    }, [newPassword, confPassword])

    const userMeta = useGlobalStore((state) => state.userMeta);

    const handleUpdate = async () => {
    const res = await updatePassword(userMeta?.email, newPassword)
        if(res === 'success'){
            setNewPassword(null)
            setConfPassword(null)
        }
    }
  return (
    <Stack sx={{height: '100%', width: '90%'}}>
        <Stack>
            {
                toggleShowPassword ? 
                    <i style={{cursor: 'pointer'}} className="fi fi-rr-eye-crossed" onClick={() => setToggleShowPassword(false)}></i>
            :
                    <i style={{cursor: 'pointer'}} className="fi fi-rr-eye" onClick={() => setToggleShowPassword(true)}></i>
            }
        </Stack>
        <FormControl sx={{paddingY: 3}}>
            <InputLabel sx={{paddingY: 1}}>New password</InputLabel>
            <Input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} sx={{paddingY: 2}} type={toggleShowPassword ? 'text':'password'} />
        </FormControl>
        <FormControl sx={{paddingY: 3}}>
            <InputLabel sx={{paddingY: 1}}>Confirm password</InputLabel>
            <Input value={confPassword} onChange={(e) => setConfPassword(e.target.value)} sx={{paddingY: 2}} type={toggleShowPassword ? 'text':'password'} />
        </FormControl>
        {match && <Button onClick={() => handleUpdate()} sx={{marginY: 2}}>Accept</Button>}
    </Stack>
  );
};

export default Password;