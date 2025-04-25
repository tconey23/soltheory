import { useEffect, useState } from 'react';
import { Avatar, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { lerp } from 'three/src/math/MathUtils.js';
import { useGlobalContext } from '../business/GlobalContext';
import { supabase } from '../business/supabaseClient';

const UserCard = ({user, card}) => {
    const [spreadNum, setSpreadNum] = useState(2);
    const [userData, setUserData] = useState()

    const getFriends = async (friendIds) => {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('primary_id', friendIds);
        if(data){
            setUserData(data[0])
        }
        return data;
      };
      
    useEffect(() => {
        if(user){
            getFriends(user.primary_id)
        }

        if(card){
            setUserData(card)
        }
    }, [])

  return (
    <Stack direction={'column'} sx={{ height: '98%', width: '100%' }} justifyContent={'center'}>
        <Stack width={'100%'} direction={'row'} alignItems={'center'} justifyContent={'flex-start'}>
            <Avatar
                src={userData?.avatar} 
                sx={{
                        marginRight: 2, 
                        boxShadow: `0px 0px 7px ${spreadNum}px ${userData?.currently_online ? '#32cd32d9' : '#ff000094'}`
                    }}/>
            <Stack justifyContent={'center'} alignItems={'flex=start'}>
                <Typography>{userData?.user_name}</Typography>
                <Typography>{userData?.email}</Typography>
            </Stack>
        </Stack>
    </Stack>
  );
};

export default UserCard;