import { useEffect, useState } from 'react';
import {Switch, Stack, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, MenuItem, Tooltip, Avatar, Modal, FormControl, Input, InputLabel, MenuList } from '@mui/material';
import { supabase } from '../business/supabaseClient';
import { useGlobalContext } from '../business/GlobalContext';
import { NewMessage } from './NewMessage';
import UserCard from './UserCard';
import FriendSettings from './FriendSettings';
import { decryptWithKey, importKeyFromBase64 } from '../business/cryptoUtils';
import ReceivedMessages from './ReceivedMessages';
import SentMessages from './SentMessages';

const MessageBox = (props) => {

  const {
    user, isMobile, messages,draftMessage, setDraftMessage, solMate, setSolMate, toggleSentRec, setToggleSentRec
  } = props

  return (
    <Stack padding={1} justifyContent={'flex-start'} alignItems={'center'} width={isMobile ? '100%' : '100%'} height={'90%'} borderRadius={5} boxShadow={'inset 1px 1px 12px 2px #0000005e'} >
          {
            draftMessage || solMate
            ? 
            <Stack justifyContent={'center'} alignItems={'center'} width={'100%'} height={'100%'}>
              <NewMessage setDraftMessage={setDraftMessage} solMate={solMate} setSolMate={setSolMate}/> 
            </Stack>
          : 
          <Stack width={'100%'}>
           <Stack direction={'row'} width={'100%'}>
            <MenuItem onClick={() => setDraftMessage(true)} sx={{justifyContent: 'center'}}>
                <Tooltip followCursor title='New message'>
                    <Avatar sx={{padding: 0.5}}>
                        <i style={{color: 'skyBlue', filter: 'drop-shadow(1px 3px 4px black)', fontSize: '30px'}} className="fi fi-sr-circle-envelope"></i>
                    </Avatar>
                </Tooltip>
            </MenuItem>
            <MenuItem onClick={() => setToggleSentRec('sent')} sx={{justifyContent: 'center'}}>
                <Tooltip followCursor title='Outbound Messages'>
                    <Avatar sx={{padding: 0.5}}>
                        <i style={{color: 'skyBlue', filter: 'drop-shadow(1px 3px 4px black)', fontSize: '30px'}} className="fi fi-sr-file-upload"></i>
                    </Avatar>
                </Tooltip>
            </MenuItem>
            <MenuItem onClick={() => setToggleSentRec('rec')} sx={{justifyContent: 'center'}}>
                <Tooltip followCursor title='Inbound Messages'>
                    <Avatar sx={{padding: 0.5}}>
                        <i style={{color: 'skyBlue', filter: 'drop-shadow(1px 3px 4px black)', fontSize: '30px'}} className="fi fi-sr-file-download"></i>
                    </Avatar>
                </Tooltip>
            </MenuItem>
            </Stack>
            <TableContainer sx={{width: '98%'}}>
              <Table>
                <TableHead>
                  <TableRow sx={{width: '80%'}}>
                    <TableCell size='small' sx={{width: '25%'}}><i className="fi fi-rr-settings"></i></TableCell>
                    <TableCell sx={{width: '25%'}}>{toggleSentRec === 'rec' ? 'Received' : 'Sent'}</TableCell>
                    <TableCell sx={{width: '25%'}}>{toggleSentRec === 'rec' ? 'From' : 'To'}</TableCell>
                    <TableCell sx={{width: '25%'}}>Subject</TableCell>
                  </TableRow>
                </TableHead>
                {
                  toggleSentRec === 'rec' 
                  ? 
                  <ReceivedMessages  messages={messages}/>
                  :
                  <SentMessages user={user}/>
                }
              </Table>
            </TableContainer>
            </Stack>
          }
        </Stack>
  )

}

const SolMatesBox = (props) => {
  const {
    user, isMobile,
    userSearch, setUserSearch,
    userMatches,setSolMate,
    friendList, setEditFriendSettings
  } = props

  return (
    <Stack marginRight={'2vw'}  sx={{overflow:'hidden'}} padding={1} alignItems={'center'} borderRadius={5} boxShadow={'inset 1px 1px 12px 2px #0000005e'} width={isMobile ? '100%' : '30%'} height={'90%'}>
            <Stack margin={1} alignItems={'center'} justifyContent={'center'}>
              <Typography fontSize={'2.5vw'} sx={{textAlign: 'center'}}  fontFamily={'Fredoka Bold'} >SOL Mates</Typography>
            </Stack>
            <Stack height={'40%'} width={'100%'} alignItems={'center'}>
              <FormControl sx={{width: '80%'}}>
                <InputLabel>Find SOL Mates</InputLabel>
                <Input value={userSearch} onChange={(e) => setUserSearch(e.target.value)}/>
              </FormControl>
              <MenuList sx={{width: '80%'}}>
                {userMatches?.map((u) => {
                  return (
                    <MenuItem onClick={() => setSolMate(u)}>
                            <UserCard card={u}/>
                    </MenuItem>
                  )})}
              </MenuList>
          </Stack>

          <Stack height={'60%'} width={'100%'} alignItems={'center'}>
            <Typography sx={{textAlign: 'center'}} fontSize={'2vw'} fontFamily={'Fredoka Bold'}>Your SOL Mates</Typography>
            <MenuList sx={{width: '100%'}}>
              {friendList?.map((f) => {
                return (
                    <Tooltip followCursor title={f.user_name} >
                        <MenuItem onClick={() => setEditFriendSettings(f)}>
                                <UserCard user={f}/>
                        </MenuItem>
                    </Tooltip>
                )})}
            </MenuList>
          </Stack>
        </Stack>
  )
}

const Messaging = () => {
  const { user, isMobile } = useGlobalContext();
  const [messages, setMessages] = useState([]);
  const [draftMessage, setDraftMessage] = useState();
  const [userSearch, setUserSearch] = useState();
  const [userMatches, setUserMatches] = useState([]);
  const [solMate, setSolMate] = useState();
  const [friendList, setFriendList] = useState([]);
  const [editFriendSetting, setEditFriendSettings] = useState(null);
  const [toggleSentRec, setToggleSentRec] = useState('rec')
  const [toggleMessages, setToggleMessages] = useState(false)

  const props ={
    user, isMobile,
    messages, setMessages,
    draftMessage, setDraftMessage,
    userSearch, setUserSearch,
    userMatches, setUserMatches,
    solMate, setSolMate,
    friendList, setFriendList,
    editFriendSetting, setEditFriendSettings,
    toggleSentRec, setToggleSentRec,
    toggleMessages, setToggleMessages
  }

  useEffect(() => {
    
    if(solMate || draftMessage){
        setToggleMessages(true)
    }

  }, [draftMessage, solMate])

  const decryptRealtime = async (data) => {
    try {
      const base64Key = data.message_cipher_key;
      if (!base64Key) throw new Error("No message cipher key attached");
      const key = await importKeyFromBase64(base64Key);
      const decSub = await decryptWithKey(data.subject, data.subject_iv, key);
      const decMess = await decryptWithKey(data.message_content, data.message_iv, key);

      data.subject = decSub;
      data.message_content = decMess;

      return data;
    } catch (err) {
      console.error("Realtime decryption failed:", err);
      return data;
    }
  };

  const handleDecrypt = async (messData) => {
    setMessages([]);
    for (let message of messData) {
      try {
        const base64Key = message.message_cipher_key;
        if (!base64Key) continue;
        const key = await importKeyFromBase64(base64Key);
        const decSub = await decryptWithKey(message.subject, message.subject_iv, key);
        const decMess = await decryptWithKey(message.message_content, message.message_iv, key);

        message.subject = decSub;
        message.message_content = decMess;

        setMessages(prev => [...prev, message]);
      } catch (error) {
        console.error("Failed decrypting message:", message, error);
      }
    }
  };

  const initialFetch = async () => {
    try {
      const { data: messData, error } = await supabase
        .from('messaging')
        .select('*')
        .filter('to->>primary_id', 'eq', user.metadata.primary_id);

      if (messData) {
        handleDecrypt(messData);
      } else if (error) {
        console.log(error);
        throw new Error(error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user?.metadata?.primary_id) {
      setFriendList(user.metadata.friends)
      initialFetch();
    }
  }, [user]);

  useEffect(() => {
    const channel = supabase
      .channel('messaging')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messaging',
      }, async (payload) => {
        if (payload.eventType === 'DELETE' && payload.old.message_id) {
          setMessages(prevMessages =>
            prevMessages.filter(m => m.message_id !== payload.old.message_id)
          );
        }

        if (payload.eventType === 'INSERT' && payload.new.to.primary_id === user?.metadata.primary_id) {
          const foundDup = messages.findIndex(m => m.id === payload.new.id);
          const decryptedMessage = await decryptRealtime(payload.new);

          if (foundDup < 0) {
            setMessages(prev => [...prev, decryptedMessage]);
          }
        }
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  const userFuzzySearch = async (searchTerm) => {
    const { data: users, error } = await supabase.from('users').select('*').ilike('user_name', `%${searchTerm}%`);
    if (users) setUserMatches(users);
  };

  useEffect(() => {
    if (userSearch) {
      userFuzzySearch(userSearch);
    } else {
      setUserMatches([]);
    }
  }, [userSearch]);

  return (
    <Stack alignItems={'center'} justifyContent={'flex-start'} direction={'column'} sx={{ height: '98%', width: '100%' }} >
      <Typography fontFamily={'Fredoka Bold'} fontSize={30}>Messaging</Typography>

        <Stack justifyContent={'space-around'} padding={0} alignItems={'center'} direction={'column'} height={'90%'} width={'90%'} borderRadius={5} boxShadow={'1px 1px 12px 2px #0000005e'}>
        <Stack>
          {isMobile && <Switch checked={toggleMessages} onChange={() => setToggleMessages(prev => !prev)}/>}
        </Stack>
      <Stack padding={2} height={'96%'} width={'96%'} direction={'row'}>

      {isMobile?
        <>
          {
            toggleMessages?
            <MessageBox {...props}/>
            :
            <SolMatesBox {...props}/>
          }
        </>
        :
        <>
          <SolMatesBox {...props}/>
          <MessageBox {...props}/>
        </>
      }
      
      </Stack>
    </Stack>
    <Modal
    open={editFriendSetting}
    >
      <Stack width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'} >
            <FriendSettings setEditFriendSettings={setEditFriendSettings} friend={editFriendSetting}/>
      </Stack>
    </Modal>

</Stack>
);
};

export default Messaging;