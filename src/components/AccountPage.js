import { use, useEffect, useRef, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, FormControl, FormLabel, ImageList, Input, InputLabel, MenuItem, Modal, Select, Stack, TextField, Tooltip } from '@mui/material';
import {Avatar} from '@mui/material';
import {Typography} from '@mui/material';
import {Button} from '@mui/material';
import Admin from './Admin';
import { useGlobalContext } from '../business/GlobalContext'
import { useNavigate } from 'react-router-dom';
import { findAvatars } from '../business/apiCalls';
import { supabase } from '../business/supabaseClient';
import { Box } from '@mui/system';

const UserName = () => {
  const { updateUser, setAlertProps } = useGlobalContext();
  const [userName, setUserName] = useState('');

  const saveUserName = async () => {
  
    const updateRes = await updateUser(userName)
    if(updateRes?.data || updateRes?.user){
      setUserName('')
      setAlertProps({
        text: 'User name updated!',
        severity: 'success',
        display: true
      })
    }

  };
  

  return (
    <FormControl title='userNameComp' >
      {!userName && <InputLabel title='userNameComp'>User name</InputLabel>}
      <Input 
      title='userNameComp'
        value={userName} 
        onChange={(e) => setUserName(e.target.value)} 
      />
      <Button title='userNameComp' onClick={saveUserName} variant="contained" sx={{ mt: 2 }}>
        Save
      </Button>
    </FormControl>
  );
};

const AvatarSelect = ({ search, setResults, results, submit, setSubmit }) => {
    const {
      user,
      avatar,
      setAvatar,
      isMobile
    } = useGlobalContext();
    

    const [newAvatar, setNewAvatar] = useState('');
    const [images, setImages] = useState([]);
  
    const searchAvatars = async () => {
      const res = await findAvatars(search);
      setResults(res);
      setSubmit(false);
    };
  
    const handleAvatarChange = async (selectedUrl) => {
      setNewAvatar(selectedUrl);
      setAvatar(selectedUrl);
      
      const { data, error } = await supabase
      .from('users')
      .update({ avatar: selectedUrl })
      .eq('primary_id', user?.metadata?.primary_id)
      .select()
        
    };
  
    useEffect(() => {
      if (results?.results?.length > 0) {
        setImages(results.results.map((r, i) => (
          <MenuItem key={i} value={r.urls.small}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={r.urls.small} sx={{ width: 32, height: 32 }} />
              <span>{`Avatar ${i + 1}`}</span>
            </Stack>
          </MenuItem>
        )));
      }
    }, [results]);
  
    useEffect(() => {
      if (search && submit) {
        searchAvatars();
      }
    }, [search, submit]);
  
    return (
      <Stack width={'100%'} maxWidth={isMobile ? '100%' : '300px'} overflow={'scroll'}>
        <Select
          fullWidth
          value={newAvatar || avatar || ''}
          onChange={(e) => handleAvatarChange(e.target.value)}
          renderValue={(selected) => (
            <Avatar src={selected} sx={{ width: 32, height: 32 }} />
          )}
        >
          {images}
        </Select>
      </Stack>
    );
  };

const AccountPage = ({size}) => {
    const {setAlertProps , user, avatar, isAdmin, logout, userData, sessionData, sessionState} = useGlobalContext()
    const nav = useNavigate()
    const [results, setResults] = useState([])
    const [submit, setSubmit] = useState(false)
    const [searchTerm, setSearchTerm] = useState()
    const [imageType, setImageType] = useState('abstract')
    const [avatarSearch, setAvatarSearch] = useState()
    const [avatarTerms, setAvatarTerms] = useState([
        'abstract', 'illustration', 'minimal', 'cartoon'
    ])
    const [pendingDeleteAccount, setPendingDeleteAccount] = useState()
    const [hoverDelete, setHoverDelete] = useState(false)
    const [deleteTimeout, setDeleteTimeout] = useState(3)
    const [deleteError, setDeleteError] = useState()
    const [displayName, setDisplayName] = useState()
    

    useEffect(() => {

      if(userData?.email && !userData?.user_metadata?.display_name){
        setDisplayName(userData.email)
      }

      if(userData?.user_metadata?.display_name){
        setDisplayName(userData.user_metadata.display_name)
      }

      if(!userData && !sessionData){ 
        nav('/login')
      }

    }, [userData, sessionData, sessionState])



    const handleDeleteAccount = async () => {
      const accessToken = sessionData?.access_token;
      const userId = userData?.id;
    
      if (!accessToken || !userId) {
        console.error(`token: ${accessToken} id: ${userId}`);
        return;
      }

      try {          
        const { error } = await supabase
        .from('users')
        .delete()
        .eq('primary_id', userId)
        if(error){
          console.log(error)
          throw new Error(error)
        }
      } catch (err) {
          setDeleteError(err)
          return
      }
    
      if(deleteError){
        return
      }

      const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/delete-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ userId })
      });
    
      const result = await response.json();
    
      if (response.ok) {
        console.log('Account deleted successfully:', result);
        await supabase.auth.signOut();
        window.location.href = '/';
      } else {
        console.error('Failed to delete account:', result);
      }
    };

    useEffect(() => {
        if(imageType && avatarSearch){
            setSearchTerm(`${imageType} + ${avatarSearch}`)
        }
    }, [imageType, avatarSearch])



      const handleLogout = async () => {
        try {
          await logout()
          setAlertProps({ text: 'Login successful', severity: 'success', display: true })
          nav('/account')
        } catch (err) {
          setAlertProps({ text: err.message, severity: 'error', display: true })
        }
      }

  
    useEffect(() => {
      if(hoverDelete && deleteTimeout > 0){
        setTimeout(() => {
          setDeleteTimeout(prev => prev -1)
        }, 1000);
      } else if(!hoverDelete) {
        setDeleteTimeout(3)
      }
    }, [hoverDelete, deleteTimeout])


  return (
        <Stack direction={'column'} sx={{ height: '100%', width: '100%', overflow: 'auto'}} justifyContent={'flex-start'} alignItems={'flex-start'}>
                <Stack width={'100%'} height={'100%'} justifyContent={'flex-start'} alignItems={'center'} sx={{resize: 'both'}}>
                    <Stack width={'100%'} justifyContent={'center'} alignItems={'center'} padding={1} margin={2}>
                      <Stack width={'20%'} justifyContent={'center'} alignItems={'center'} padding={1}>
                        <Avatar sx={{ width: 50, height: 50, mb: 2 }} src={avatar} />
                        {displayName && <Typography variant="h7">Welcome, {displayName}!</Typography>}
                      </Stack>
                        <Stack width={'80%'}>
                          <Accordion>
                              <AccordionSummary>
                                Account Controls
                              </AccordionSummary>
                              <AccordionDetails>
                                <Stack width={'85%'} overflow={'auto'} userdata='accrodion_wrapper' height={'60%'}>
                                  <Accordion>
                                    <AccordionSummary>
                                      <Typography>Account Details</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                      <Accordion>
                                        <AccordionSummary>
                                          Change avatar
                                        </AccordionSummary>
                                        <AccordionDetails>
                                        <Stack justifyContent={'center'} alignItems={'center'}>
                                          <Avatar sx={{ width: 50, height: 50, mb: 2 }} src={avatar}/>
                                          <Select value={imageType} onChange={(e) => setImageType(e.target.value)}>  
                                              {avatarTerms.map((t, i) => (
                                                <MenuItem key={i} value={t}>
                                                      <Typography>{t}</Typography>
                                                  </MenuItem>
                                              ))}
                                          </Select>
                                          <FormLabel>Image Search Term</FormLabel>
                                          <TextField value={avatarSearch} onChange={(e) => setAvatarSearch(e.target.value)}/>
                                          <Button onClick={() => setSubmit(true)} >Search</Button>
                                          <AvatarSelect results={results} setResults={setResults} search={searchTerm} submit={submit} setSubmit={setSubmit}/>
                                      </Stack>
                                        </AccordionDetails>
                                      </Accordion>
                                
                                      <Accordion title='userNameAccordion'>
                                        <AccordionSummary title='userNameAccordionSummary'>
                                          Change user name
                                        </AccordionSummary>
                                          <AccordionDetails title='userNameAccordionDetails'>
                                              <UserName/>
                                          </AccordionDetails>
                                      </Accordion>

                                    </AccordionDetails>
                                  </Accordion>
                                    {isAdmin && 
                                      <Accordion>
                                        <AccordionSummary>
                                            <Typography>Admin Controls</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Stack height={'100%'} width={'95%'} justify-content={'space-evenly'}>
                                                <Admin size={size}/>
                                            </Stack>
                                        </AccordionDetails>
                                      </Accordion>
                                    }
                                </Stack>
                                <Tooltip followCursor title={deleteTimeout > 0 ? deleteTimeout : 'Delete Account'}>
                                  <Stack
                                      justifySelf={'flex-start'}
                                      onMouseOver={() => setHoverDelete(true)}
                                      onMouseOut={() => setHoverDelete(false)}
                                  >
                                  <Button onClick={() => setPendingDeleteAccount(true)} disabled={deleteTimeout > 0} >Delete Account</Button>
                                  </Stack>
                                </Tooltip>
                              </AccordionDetails>
                            </Accordion>
                          </Stack>
                        <Button variant="contained" color="error" onClick={handleLogout} sx={{ mt: 2 }}>
                            Logout
                        </Button>
                      </Stack>
                </Stack>
                <Modal
                  open={!!pendingDeleteAccount}
                >
                  <Stack width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'}>
                    <Box bgcolor={'white'} padding={3}>
                      <Typography>Are you sure you want to delete your account?</Typography>
                      <Button onClick={() => handleDeleteAccount()}>Yes</Button>
                      <Button onClick={() => setPendingDeleteAccount(false)}>No</Button>
                    </Box>
                  </Stack>
                </Modal>
        </Stack>
  );
};

export default AccountPage;