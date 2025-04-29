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

const UserGames = () => {

  const {user, updateUserField} = useGlobalContext()
  const [gameData, setGameData] = useState()

  useEffect(() => {
    if(user?.game_data){
      setGameData(user?.game_data)
    }
  }, [user])

  const handleDelete = async (index) => {
    let currentGameData = user?.game_data || [];
    
    const updatedGameData = currentGameData.filter((_, i) => i !== index);
  
    console.log('Updated game data:', updatedGameData);
  
    const res = await updateUserField({ game_data: updatedGameData });
  
    if (res) {
      console.log('Game data updated successfully');
    }
  };

  const games = ['TwentyOneThings', '6Pics']
  

  return (
    <>
    {games.map((g) => (

      <Accordion>
        <AccordionSummary>{g}</AccordionSummary>

        <AccordionDetails>
          {gameData?.map((d,i) => {
            if(d.game === g){
              return <>
                        <Accordion>
                          <AccordionSummary>
                            {d.game_date}
                          </AccordionSummary>
                          <AccordionDetails>
                            <Button onClick={() => handleDelete(i)}>
                              <i class="fi fi-sr-trash"></i>
                            </Button>
                            {d.stages.map((s) => {
                              return <Stack direction={'row'} justifyContent={'center'} marginY={2}>
                                {s.map((p) => {
                                  return (
                                  <Stack borderRadius={5} boxShadow={`0px 0px 3px 4px ${p.color}`} padding={1} alignItems={'center'}  justifyContent={'center'} height={100} width={'11%'} marginX={1} bgcolor={p.color}>
                                    <Typography sx={{width:'100%'}} alignItems={'center'} textAlign={'center'} fontFamily={'Fredoka Regular'} fontSize={12}>{p.prompt}</Typography>
                                  </Stack>)
                                })}
                              </Stack>
                            })}
                         
                            <Stack alignItems={'center'}  justifyContent={'center'} height={100} width={'100%'} marginX={1} bgcolor={'white'}>
                              <Stack alignItems={'center'} height={100} width={'50%'} borderRadius={5} boxShadow={`0px 0px 3px 4px black`} padding={1}>
                                <Typography sx={{height: '100%'}} textAlign={'center'} fontFamily={'Fredoka Regular'} fontSize={12}>{d.note}</Typography>
                              </Stack>
                            </Stack>
                          </AccordionDetails>
                        </Accordion>
                     </>
            }
          })}
        </AccordionDetails>
      </Accordion>
      ))}
    </>
  )
}

const UserName = () => {
  const { updateUser, setAlertProps, updateUserField } = useGlobalContext();
  const [userName, setUserName] = useState('');

  const saveUserName = async () => {


  
    const updateRes = await updateUserField({'display_name': userName})
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

const AvatarSelect = ({ search, setResults, results, submit, setSubmit}) => {
    const {
      user,
      avatar,
      setAvatar,
      isMobile,
      updateUserField
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
      
      updateUserField({avatar: selectedUrl})
        
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
    const {setAlertProps, isAdmin, logout, userData, sessionData, sessionState, user} = useGlobalContext()
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
    const [adminControls, setAdminControls] = useState()

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

    useEffect(() =>{
      // console.log(userData)
    }, [userData])

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
                        <Avatar sx={{ width: 50, height: 50, mb: 2 }} src={user?.avatar} />
                        {displayName && <Typography variant="h7">Welcome, {user?.display_name}!</Typography>}
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
                                          <Avatar sx={{ width: 50, height: 50, mb: 2 }} src={user?.avatar}/>
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

                                      <Accordion title='gameAccordion'>
                                        <AccordionSummary title='gameAccordionSummary'>
                                          My games
                                        </AccordionSummary>
                                          <AccordionDetails title='gameAccordionDetails'>
                                              <UserGames />
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
                                              <Stack width={'25%'}>
                                                {user?.is_super && <Button onClick={() => nav('/account/admin/super_user_controls')}>Super User Controls</Button>}
                                              </Stack>
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