import { useEffect, useState } from 'react';
import { Avatar, List, MenuItem, Stack, Typography } from '@mui/material';
import { getAllUsers, getUser } from '../business/apiCalls';
import { useGlobalContext } from '../business/GlobalContext';

const Friends = () => {
    const [users, setUsers] = useState([])
    

    const fetchUsers = async () =>{
        const res = await getAllUsers()
        
        if(res){
          res.forEach((r) => {
            const foundIndex = users.findIndex((i) => i.primary_id === r.primary_id) 
            if(foundIndex < 0){
              setUsers(prev => ([
                ...prev,
                r
              ]))
            }
          })
        }
    }

    useEffect(() =>{
        fetchUsers()
    }, [])

  return (
    <Stack direction={'column'} sx={{ height: '98vh', width:'100%' }} justifyContent={'flex-start'} alignItems={'center'} >
                <Stack direction={'column'} justifyContent={'center'} alignContent={'center'} width={'100%'}>
                    <Stack alignItems={'center'} margin={5}>
                      <Typography fontFamily={'Fredoka Regular'} fontWeight={'bold'} fontSize={20} >Social</Typography>
                    </Stack>
                    <Stack width={'100%'} direction={'row'} alignItems={'flex-start'} justifyContent={'center'}>
                        <Stack width={'33%'} alignItems={'center'}>
                          <Typography>Users</Typography>
                            <List>
                              {users.map((u) => {
                              return (
                                <MenuItem>
                                    <Stack direction={'row'} justifyContent={'space-around'} alignItems={'center'} >
                                      <Avatar src={u.avatar} />
                                      <Typography sx={{marginLeft: 1}}>{u.user_name}</Typography>
                                    </Stack>
                                </MenuItem>
                              )})}
                            </List>
                        </Stack>  
                        <Stack width={'33%'} alignItems={'center'}>
                          <Typography>Requests</Typography>
                        </Stack> 
                        <Stack width={'33%'} alignItems={'center'}>
                          <Typography>Friends</Typography>
                        </Stack> 
                    </Stack>
                </Stack>
    </Stack>
  );
};

export default Friends;