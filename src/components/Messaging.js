import { useEffect, useState } from 'react';
import { AppBar, Avatar, Button, FormControl, Input, InputLabel, List, Menu, MenuItem, MenuList, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import { supabase } from '../business/supabaseClient';
import { useGlobalContext } from '../business/GlobalContext';
import { MessageItem } from './MessageItem';
import { NewMessage } from './NewMessage';
import UserCard from './UserCard';

const Messaging = () => {

    const {cipherKey, avatar} = useGlobalContext()
    const {user, setAlertProps} = useGlobalContext()
    const [messages, setMessages] = useState([])
    const [draftMessage, setDraftMessage] = useState()
    const [userSearch, setUserSearch] = useState()
    const [userMatches, setUserMatches] = useState([])
    const [solMate, setSolMate] = useState()
    const [friendList, setFriendList] = useState([])

    useEffect(() => {
        if(user && user?.metadata?.friends){
            setFriendList(user.metadata.friends)
        }
    }, [user])

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

      const handleDecrypt = async (messData) => {
        setMessages([])
        for(let i = 0; i < messData.length; i ++){

            const decSub = await decryptText({
                data: messData[i].subject,
                iv: messData[i].subject_iv,
              });

              const decMess = await decryptText({
                data: messData[i].message_content,
                iv: messData[i].message_iv,
              });

              messData[i].message_content = decMess
              messData[i].subject = decSub

              setMessages(prev => [
                ...prev,
                messData[i]
              ])
        }
      }

    const initialFetch = async () => {
        try {

            let { data: messData, error } = await supabase
            .from('messaging')
            .select('*')
            .filter('to->>primary_id', 'eq', user.metadata.primary_id)

            if(messData){
                handleDecrypt(messData)
            } else if (error) {
                console.log(error)
                throw new Error(error)
            }
            
        } catch (err) {
            console.log(err);
            
        }
    }

    const decryptRealtime = async (data) => {
        const decSub = await decryptText({
          data: data.subject,
          iv: data.subject_iv,
        });
      
        const decMess = await decryptText({
          data: data.message_content,
          iv: data.message_iv,
        });

        data.subject = decSub
        data.message_content = decMess
      
        return data
      };


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
          }, async (payload) => {

            console.log(payload.eventType)
          
            if (payload.eventType === 'DELETE' && payload.old.message_id) {
              setMessages((prevMessages) =>
                prevMessages.filter((m) => m.message_id !== payload.old.message_id)
              );
            }
          
            if (payload.eventType === 'INSERT' && payload.new.to.primary_id === user?.metadata.primary_id) {
              const foundDup = messages.findIndex((m) => m.id === payload.new.id);
          
              const decryptedMessage = await decryptRealtime(payload.new);
              
          
              if (foundDup < 0) {
                setMessages((prev) => [...prev, decryptedMessage]);
              }
            }
          })
        .subscribe();
    
      return () => supabase.removeChannel(channel);
    }, [user]);

    const userFuzzySearch = async (searchTerm) => {
        const { data: users, error } = await supabase
          .from('users')
          .select('*')
          .ilike('user_name', `%${searchTerm}%`);
      
        if (error) {
          console.error('Search error:', error);
        } else {
          setUserMatches(users)
        }
    };

    useEffect(() =>{
        if(userSearch){
            userFuzzySearch(userSearch)
        } else {
            setUserMatches([])
        }
    }, [userSearch])

    const getUserData = async (friend) => {
        let { data: user, error } = await supabase
        .from('users')
        .select("*")
        .eq('primary_id', friend)

        return user
    }

  return (
    <Stack alignItems={'center'} justifyContent={'flex-start'} direction={'column'} sx={{ height: '98%', width: '100%' }} >
      <Typography fontFamily={'Fredoka Bold'} fontSize={30}>Messaging</Typography>

        <Stack justifyContent={'space-around'} padding={2} alignItems={'center'} direction={'row'} height={'90%'} width={'90%'} borderRadius={5} boxShadow={'1px 1px 12px 2px #0000005e'}>

            <Stack alignItems={'center'} borderRadius={5} boxShadow={'inset 1px 1px 12px 2px #0000005e'} width={'20%'} height={'90%'}>
                <Stack margin={2} alignItems={'center'} justifyContent={'center'}>
                    <Typography fontFamily={'Fredoka Bold'} fontSize={25}>SOL Mates</Typography>
                </Stack>
                <Stack height={'40%'}>
                    <FormControl sx={{width: '80%'}}>
                        <InputLabel>Find SOL Mates</InputLabel>
                        <Input value={userSearch} onChange={(e) => setUserSearch(e.target.value)}/>
                    </FormControl>
                    <MenuList sx={{width: '80%'}}>
                        {userMatches.map((u) => {
                            
                            return (
                            <MenuItem onClick={() => setSolMate(u)}>
                                <UserCard card={u}/>
                            </MenuItem>
                            )})}
                    </MenuList>
                </Stack>
                <Stack height={'60%'} width={'80%'}>
                    <Typography fontFamily={'Fredoka Bold'}>Your SOL Mates</Typography>
                    <MenuList sx={{width: '80%'}}>
                        {friendList.map((f) => {
                            return (
                            <MenuItem>
                                <UserCard user={f}/>
                            </MenuItem>
                            )})}
                    </MenuList>
                </Stack>
            </Stack>

            <Stack padding={1} justifyContent={'flex-start'} alignItems={'center'} width={'70%'} height={'90%'} borderRadius={5} boxShadow={'inset 1px 1px 12px 2px #0000005e'} >

                {
                    draftMessage || solMate
                    ? 
                    <Stack justifyContent={'center'} alignItems={'center'} width={'100%'} height={'100%'}>
                        <NewMessage setDraftMessage={setDraftMessage} solMate={solMate} setSolMate={setSolMate}/> 
                    </Stack>
                    : 
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <Stack direction={'row'}>
                                    <MenuItem onClick={() => setDraftMessage(true)} sx={{justifyContent: 'center'}}>
                                        <Tooltip followCursor title='New message'>
                                            <Avatar>
                                                <i style={{color: 'skyBlue', filter: 'drop-shadow(1px 3px 4px black)', fontSize: '40px'}} className="fi fi-sr-circle-envelope"></i>
                                            </Avatar>
                                        </Tooltip>
                                    </MenuItem>
                                    </Stack>
                                </TableRow>
                                <TableRow>
                                    <TableCell><i className="fi fi-rr-settings"></i></TableCell>
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