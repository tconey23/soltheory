import { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, FormLabel, ImageList, MenuItem, Select, Stack, TextField } from '@mui/material';
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
      const res = await updateUserAvatar(user?.user?.id, selectedUrl);
      if (res?.success) {
        console.log('Avatar updated in Supabase');
      } else {
        console.error('Avatar update failed');
      }
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

    const getUserData = async () => {

      const res = await getUser(user.user.email)
      console.log(res)

    }
  

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
      console.log(user?.user.email)
        if(!user){
            nav('/login')
        }

        // if(user?.user?.email){
        //   getUserData()
        // }
    }, [user])


  return (
        <Stack direction={'column'} sx={{ height: '100%', width: '100%', overflow: 'auto'}} justifyContent={'flex-start'} alignItems={'flex-start'}>
                <Stack width={'100%'} height={'100%'} justifyContent={'flex-start'} alignItems={'center'} sx={{resize: 'both'}}>
                    <Stack width={'20%'} justifyContent={'center'} alignItems={'center'} padding={1} margin={2}>
                        <Avatar sx={{ width: 50, height: 50, mb: 2 }} src={avatar} />
                        <Typography variant="h7">Welcome, {user?.user?.email}!</Typography>
                        <Button variant="contained" color="error" onClick={handleLogout} sx={{ mt: 2 }}>
                            Logout
                        </Button>
                    </Stack>
                    <Stack width={'85%'} overflow={'auto'} userdata='accrodion_wrapper' height={'60%'}>
                    <Accordion>
                        <AccordionSummary>
                            <Typography>Account Details</Typography>
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
                                <Typography>Admin Controls</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Stack height={'100%'} width={'95%'} justify-content={'space-evenly'}>
                                    {isAdmin && <Admin size={size}/>}
                                </Stack>
                            </AccordionDetails>
                        </Accordion>
                    </Stack>
                </Stack>
        </Stack>
  );
};

export default AccountPage;