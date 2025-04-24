import { useEffect, useState } from 'react';
import { List, MenuItem, Stack, Typography } from '@mui/material';
import { supabase } from '../business/supabaseClient';
import { useGlobalContext } from '../business/GlobalContext';

const MessageItem = ({data}) => {

    const [keys, setKeys] = useState([])

    console.clear()
    console.log(data)

    useEffect(() => {
        if(data){
            setKeys(Object.keys(data).map((d) => (d)))
        }
    }, [data])

    useEffect(() => {
        console.log(keys)
    }, [keys])

    return (
        <MenuItem>
            <Stack>
                {keys.map((k) => (
                    <Stack direction={'row'}>
                        {typeof data[k] === 'string' &&
                        <>
                            <Typography>{k}</Typography>
                            <Typography>{data[k]}</Typography>
                        </>
                         }
                    </Stack>
                    ))}
            </Stack>
        </MenuItem>
    )
}

const Messaging = () => {

    const {user, setAlertProps} = useGlobalContext(0)
    const [messages, setMessages] = useState([])

    const initialFetch = async () => {
        // console.log(user.metadata.primary_id)
        try {

            let { data: messData, error } = await supabase
            .from('messaging')
            .select('*')
            .filter('to->>primary_id', 'eq', user.metadata.primary_id)

            if(messData){
                setMessages(messData)
            } else if (error) {
                console.log(error)
                throw new Error(error)
            }
            
        } catch (err) {
            console.log(err);
            
        }
    }


    useEffect(() =>{
        if(user?.metadata?.primary_id){
            initialFetch()
        }
    }, [user])

    useEffect(() => {
      
      const channel = supabase
        .channel('messaging')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'messaging',
        }, (payload) => {
          console.log(payload)
          if (payload.eventType === 'UPDATE' && payload.new.to.primary_id === user?.metadata.primary_id) {

            const foundDup = messages.findIndex((m) => m.id === payload.new.id)

            if(foundDup < 0){
                setMessages(prev => [
                    ...prev,
                    payload.new
                ]);
            }

          }
        })
        .subscribe();
    
      return () => supabase.removeChannel(channel);
    }, [user]);

  return (
    <Stack direction={'column'} sx={{ height: '98%', width: '100%' }}>
      <Typography>Messaging</Typography>
      <List>
        {messages.map((m) => (
            <MessageItem data={m} />
        ))}
      </List>
    </Stack>
  );
};

export default Messaging;