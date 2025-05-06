import { useEffect, useState } from 'react';
import { Avatar, Button, Input, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { updateUserName } from '../business/supabase_calls';
import useGlobalStore from '../business/useGlobalStore';

const Username = () => {
        const [newUserName, setNewUserName] = useState()
        const userMeta = useGlobalStore((state) => state.userMeta);

        const handleUpdate = async () => {
        const res = await updateUserName(userMeta?.primary_id, newUserName)
            if(res === 'success'){
                setNewUserName(null)
            }
        }

  return (
    <Stack>
        <InputLabel sx={{paddingY: 1}}>User name</InputLabel>
        <Input value={newUserName} onChange={(e) => setNewUserName(e.target.value)} sx={{paddingY: 2}} type='text' />
        {newUserName && <Button onClick={() => handleUpdate()} sx={{marginY: 2}}>Accept</Button>}
    </Stack>
    );
};

export default Username;