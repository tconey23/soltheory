import { useEffect, useState } from 'react';
import {Switch, Stack, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, MenuItem, Tooltip, Avatar, Modal, FormControl, Input, InputLabel, MenuList, List } from '@mui/material';
import { supabase } from '../business/supabaseClient';
import { useGlobalContext } from '../business/GlobalContext';
import { NewMessage } from './NewMessage';
import UserCard from './UserCard';
import FriendSettings from './FriendSettings';
import { decryptWithKey, importKeyFromBase64 } from '../business/cryptoUtils';
import ReceivedMessages from './ReceivedMessages';
import SentMessages from './SentMessages';

const MessageBox = (props) => {

  const {userMetaData, messages} = useGlobalContext()

  const {
    user, isMobile, draftMessage, setDraftMessage, solMate, setSolMate, toggleSentRec, setToggleSentRec
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
                  <ReceivedMessages />
                  :
                  <SentMessages user={userMetaData}/>
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
              <List sx={{width: '90%', bgcolor: 'white', zIndex: 1000000}}>
                {userMatches?.map((u) => {
                  return (
                    <MenuItem onClick={() => setSolMate(u)}>
                            <UserCard card={u}/>
                    </MenuItem>
                  )})}
              </List>
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
  const { user, isMobile, allUsers, userMetaData, messages, setMessages, initialFetch} = useGlobalContext();
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


  useEffect(() => {
    if (userMetaData?.friends) {
      setFriendList(userMetaData?.friends)
    }
  }, [userMetaData]);


  const userFuzzySearch = async (searchTerm, dataTable) => {

    let length = searchTerm.length
    let search
    
    searchTerm.split().forEach((l) =>{
      search = l.toLowerCase()
    })
      
      let users = dataTable.filter((u) => 
        u?.user_metadata?.email?.split()[0].slice(0, length).toLowerCase() === search
      ||
      u?.user_metadata?.display_name?.split()[0].slice(0, length).toLowerCase() === search
    )
    
    if(searchTerm === '*'){
      users = dataTable
    }

    if (users) setUserMatches(users);
  };

  useEffect(() => {
    if (userSearch && allUsers) {
      userFuzzySearch(userSearch, allUsers.users);
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