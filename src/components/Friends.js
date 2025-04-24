import { useEffect, useState } from 'react';
import { Avatar, List, MenuItem, Modal, Stack, Typography } from '@mui/material';
import { getAllUsers, getUser } from '../business/apiCalls';
import { useGlobalContext } from '../business/GlobalContext';
import { supabase } from '../business/supabaseClient';
import Messaging from './Messaging';

const Friends = () => {
    const [users, setUsers] = useState([])
    const [currentUser, setCurrentUser] = useState()
    const {user, setAlertProps} = useGlobalContext()
    const [requests, setRequests] = useState([])
    const [sendMessage, setSendMessage] = useState(false)

    const getRequests = async () => {
      console.log(user.metadata)
      let { data: reqData, error } = await supabase
      .from('users')
      .select("friend_requests") 
      .eq('primary_id', user.metadata.primary_id)

      if(reqData){
        console.log(reqData)
        setRequests(reqData[0].friend_requests)
      }
    }

    useEffect(() => {
      
      const channel = supabase
        .channel('users')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'users',
        }, (payload) => {
          console.log(payload)
          if (payload.eventType === 'UPDATE' && payload.new.primary_id === currentUser?.metadata.primary_id) {
            setRequests(payload.new.friend_requests);
          }
        })
        .subscribe();
    
      return () => supabase.removeChannel(channel);
    }, [user]);

    useEffect(() => {
      console.log(requests)
    }, [requests])

    useEffect(() => {
      if(user && user.metadata){
      
        setCurrentUser(user)
        getRequests()
      }
    }, [user])

    useEffect(() => {
      // console.log(currentUser)
    }, [currentUser])

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
                              {users.map((u, i) => {
                                
                                if(u.primary_id === currentUser?.metadata?.primary_id){
                                  return
                                }
                              return (
                                <MenuItem key={i}>
                                    <Stack direction={'row'} justifyContent={'space-around'} alignItems={'center'} >
                                      <Avatar src={u.avatar} sx={{border: u.currently_online ? '2px solid limeGreen' : 'none'}}/>
                                      <Typography sx={{marginLeft: 1}}>{u.user_name}</Typography>
                                    </Stack>
                                </MenuItem>
                              )})}
                            </List>
                        </Stack>  
                        <Stack width={'33%'} alignItems={'center'}>
                          <Typography>Requests</Typography>
                          <List>
                            {requests.map((r) => (
                              <MenuItem>

                              <Stack>

                                <Stack direction={'row'} alignItems={'center'}>
                                  <Typography>Received: </Typography>
                                  <Typography>{`${r.date} ${r.time}`}</Typography>
                                </Stack>

                                <Stack direction={'row'} alignItems={'center'}>
                                  <Typography>From: </Typography>
                                  <Typography>{r.from}</Typography>
                                </Stack>

                              </Stack>
                                
                              </MenuItem>
                            ))}
                          </List>
                        </Stack> 
                        <Stack width={'33%'} alignItems={'center'}>
                          <Typography>Your friends</Typography>
                          <List>
                            {currentUser?.metadata?.friends?.map((f) => {
                              
                              return (
                                <>
                                  <MenuItem>{f.email}</MenuItem>
                                </>
                            )})}
                          </List>
                        </Stack> 
                    </Stack>
                </Stack>
                <Modal open={sendMessage}>
                  <Messaging />
                </Modal>
    </Stack>
  );
};

export default Friends;