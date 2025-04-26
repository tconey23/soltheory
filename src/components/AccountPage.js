import { use, useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, FormControl, FormLabel, ImageList, Input, InputLabel, MenuItem, Modal, Select, Stack, TextField, Tooltip } from '@mui/material';
import {Avatar} from '@mui/material';
import {Typography} from '@mui/material';
import {Button} from '@mui/material';
import Admin from './Admin';
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { getUser, signOut, updateUserAvatar } from '../business/apiCalls';
import { useGlobalContext } from '../business/GlobalContext'
import { useNavigate } from 'react-router-dom';
import { findAvatars } from '../business/apiCalls';
import { supabase } from '../business/supabaseClient';
import { Box } from '@mui/system';

const UserName = () => {
  const { user, setUser } = useGlobalContext();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (user?.user?.user?.user_metadata?.name) {
      setUserName(user.user.user.user_metadata.name);
    }
    console.log(user)
  }, [user]);

  const saveUserName = async () => {
    const primaryId = user?.user?.user?.id;
  
    console.log('Primary ID:', primaryId);
    console.log('User Name:', userName);
  
    if (!primaryId || !userName) {
      console.error('Missing user data!');
      return;
    }
  
    // 1. Update users table
    const { data, error } = await supabase
      .from('users')
      .update({ user_name: userName })
      .eq('primary_id', primaryId)
      .select();
  
    if (error) {
      console.error('Error updating user name:', error.message);
      return;
    }
  
    console.log('User name updated in users table:', data);
  
    // 2. Update Auth user metadata
    const { data: authData, error: authError } = await supabase.auth.updateUser({
      data: { name: userName }
    });
  
    if (authError) {
      console.error('Error updating auth metadata:', authError.message);
    } else {
      console.log('User metadata updated successfully:', authData);
  
      // 3. Optimistically update local user state
      setUser((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          user: {
            ...prev.user.user,
            user_metadata: {
              ...prev.user.user.user_metadata,
              name: userName
            }
          }
        }
      }));
    }
  };
  
  
  

  return (
    <FormControl>
      {!userName && <InputLabel>User name</InputLabel>}
      <Input 
        value={userName} 
        onChange={(e) => setUserName(e.target.value)} 
      />
      <Button onClick={saveUserName} variant="contained" sx={{ mt: 2 }}>
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
    const {alertProps, setAlertProps , user, setUser, isAdmin, setisAdmin, displayName, setDisplayName, avatar, setAvatar} = useGlobalContext()
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
    const [canDelete, setCanDelete] = useState(false)
    const [hoverDelete, setHoverDelete] = useState(false)

    const [deleteTimeout, setDeleteTimeout] = useState(3)
    const [deleteError, setDeleteError] = useState()

    useEffect(() => {
      console.log(deleteError)
    }, [deleteError])

    const handleDeleteAccount = async () => {
      const accessToken = user?.user?.access_token;
      const userId = user?.user?.user?.id;
    
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
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('user');
        localStorage.setItem('isAuthenticated', 'false');

        const res = await signOut()
        console.log('[Logout Result]', res)
      
        if (res.disposition === 'success') {
          setUser(null)
          setAlertProps({
            text: 'You have been logged out',
            severity: 'success',
            display: true,
          })
        } else {
          console.error('[Logout Error]', res.error)
          setAlertProps({
            text: res.message,
            severity: 'error',
            display: true,
          })
        }
      }

    useEffect(() =>{
        if(!user){
            nav('/login')
        }
        console.log(user)
    }, [user])

  
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
                        <Typography variant="h7">Welcome, {user?.metadata?.email}!</Typography>
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
                                      
                                      <Accordion>
                                        <AccordionSummary>
                                          Change user name
                                        </AccordionSummary>
                                          <AccordionDetails>
                                              <UserName />
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
                  open={pendingDeleteAccount}
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