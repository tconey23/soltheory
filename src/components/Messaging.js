import { useEffect, useState } from 'react';
import { AppBar, Avatar, Button, FormControl, Input, InputLabel, List, Menu, MenuItem, MenuList, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import { supabase } from '../business/supabaseClient';
import { useGlobalContext } from '../business/GlobalContext';

const NewMessage = ({setDraftMessage}) => {
    const {user, setAlertProps, cipherKey} = useGlobalContext()
    const [to, setTo] = useState()
    const [subject, setSubject] = useState()
    const [messageText, setMessageText] = useState()
    const [suggestions, setSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)

    const encryptText = async (text) => {
        const encoder = new TextEncoder();
        const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for GCM
      
        const ciphertext = await crypto.subtle.encrypt(
          { name: "AES-GCM", iv },
          cipherKey,
          encoder.encode(text)
        );
      
        return {
          iv: btoa(String.fromCharCode(...iv)),
          data: btoa(String.fromCharCode(...new Uint8Array(ciphertext)))
        };
      };

      const decryptText = async ({ data, iv }) => {
        const decoder = new TextDecoder();
        const ivBytes = Uint8Array.from(atob(iv), c => c.charCodeAt(0));
        const encryptedBytes = Uint8Array.from(atob(data), c => c.charCodeAt(0));
      
        const decrypted = await crypto.subtle.decrypt(
          { name: "AES-GCM", iv: ivBytes },
          cipherKey,
          encryptedBytes
        );
      
        return decoder.decode(decrypted);
      };


    const getUserSuggestions = async () => {

        let { data: users, error } = await supabase
        .from('users')
        .select('*')

        if(users){
            setSuggestions(users)
        }
        
    }

    useEffect(() => {
        if(to) {
            setShowSuggestions(false)
        }
    }, [to])

    useEffect(() => {
        getUserSuggestions()
    }, [])

    const sendMessage = async () => {
        const date = new Date();
      
        const encryptedSubject = await encryptText(subject);
        const encryptedMessage = await encryptText(messageText);
      
        const payload = {
          from: user.metadata,
          to: to,
          subject: encryptedSubject.data,
          subject_iv: encryptedSubject.iv,
          message_content: encryptedMessage.data,
          message_iv: encryptedMessage.iv,
          created_at: date.toISOString(),
        };
      
        try {
          const { data, error } = await supabase
            .from('messaging')
            .insert([payload])
            .select();
      
          if (data) {
            console.log(data);
            setDraftMessage(false);
          } else if (error) {
            console.error(error);
            throw new Error(error);
          }
        } catch (err) {
          console.error(err);
        }
      };

    return (
        <Stack width={'80%'} height={'80%'}>

            <FormControl sx={{marginY: 2}}>
                {!to && <InputLabel>To: </InputLabel>}
                <Input value={to?.email} onFocus={() => setShowSuggestions(true)} onChange={(e) => setTo(e.target.value)} />
                {showSuggestions && 
                    <MenuList>
                    {suggestions.map((s) => {
                        // console.log(s)
                        return (
                        <MenuItem onClick={() => setTo(s)} >{s.email}</MenuItem>
                    )})}
                </MenuList>}
            </FormControl>

            <FormControl sx={{marginY: 2}}>
                <InputLabel>Subject: </InputLabel>
                <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
            </FormControl>

            <FormControl sx={{marginY: 2}}>
                <InputLabel>Message: </InputLabel>
                <Input multiline value={messageText} onChange={(e) => setMessageText(e.target.value)} />
            </FormControl>

            <Stack direction={'row'} >
                <Button onClick={() => sendMessage()} >Send</Button>
                <Button onClick={() => setDraftMessage(false)} >Cancel</Button>
            </Stack>

        </Stack>
    )
}


const MessageItem = ({data}) => {
    const [isHover, setIsHover] = useState(false)

    return (
        <TableRow
            onMouseOut={() => setIsHover(false)} 
            onMouseOver={() => setIsHover(true)}
            sx={{
                backgroundColor: isHover ? 'skyBlue' : 'white',
                cursor: isHover ? 'pointer' : '',
                transition: 'all 1s ease-in-out'
            }}
         >
            <TableCell>{data.created_at}</TableCell>
            <TableCell>{data.from.email}</TableCell>
            <TableCell>{data.subject}</TableCell>
        </TableRow>
    )
}

const Messaging = () => {

    const {user, setAlertProps} = useGlobalContext(0)
    const [messages, setMessages] = useState([])
    const [draftMessage, setDraftMessage] = useState()

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
        //   console.log('payload',payload)
        //console.log(payload.new.to.primary_id)
        //console.log(user?.metadata.primary_id)
        //console.log(payload.eventType === 'UPDATE' && payload.new.to.primary_id === user?.metadata.primary_id)
        console.log(payload)
          if (payload.eventType === 'INSERT' && payload.new.to.primary_id === user?.metadata.primary_id) {

            const foundDup = messages.findIndex((m) => m.id === payload.new.id)
            console.log(foundDup)
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
    <Stack alignItems={'center'} justifyContent={'flex-start'} direction={'column'} sx={{ height: '98%', width: '100%' }}>
      <Typography fontFamily={'Fredoka Bold'} fontSize={30}>Messaging</Typography>

        <Stack justifyContent={'space-around'} padding={2} alignItems={'center'} direction={'row'} height={'90%'} width={'90%'} border={'1px solid black'} >

            <Stack borderRadius={5} boxShadow={'inset 1px 1px 12px 2px #0000005e'} width={'20%'} height={'90%'}>
                <MenuList>

                    <MenuItem onClick={() => setDraftMessage(true)} sx={{justifyContent: 'center'}}>
                        <Tooltip followCursor title='New message'>
                            <Avatar>
                                <i style={{color: 'skyBlue', filter: 'drop-shadow(1px 3px 4px black)', fontSize: '40px'}} class="fi fi-sr-circle-envelope"></i>
                            </Avatar>
                        </Tooltip>
                    </MenuItem>

                    <MenuItem sx={{justifyContent: 'center'}}>
                        <Tooltip followCursor title='Inbox'>
                            <Avatar>
                                 <i style={{color: 'skyBlue', filter: 'drop-shadow(1px 3px 4px black)', fontSize: '25px'}} class="fi fi-br-inbox-full"></i>
                            </Avatar>
                        </Tooltip>
                    </MenuItem>

                </MenuList>
            </Stack>

            <Stack padding={1} justifyContent={'flex-start'} alignItems={'center'} width={'70%'} height={'90%'} borderRadius={5} boxShadow={'inset 1px 1px 12px 2px #0000005e'} >
                
                {
                    draftMessage 
                    ? 
                    <Stack justifyContent={'center'} alignItems={'center'} width={'100%'} height={'100%'}>
                        <NewMessage setDraftMessage={setDraftMessage} /> 
                    </Stack>
                    : 
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Received</TableCell>
                                    <TableCell>From</TableCell>
                                    <TableCell>Subject</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {messages.map((m) => (
                                    <MessageItem data={m}/>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                }
                

            </Stack>

    
        </Stack>
   
    </Stack>
  );
};

export default Messaging;